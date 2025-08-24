"use client";

import React, { useRef, useState } from "react";
import { Header } from "@/components/Header";

/**
 * Flow Builder IA — MVP (solo React + Tailwind)
 *
 * ✔️ Drag de nodos
 * ✔️ Conexiones por click (salida → entrada) con prevención de ciclos
 * ✔️ Runner con pasos (timeline), barra de progreso y log
 * ✔️ Nodo AgenteIA con opciones básicas (simuladas) y recomendación final
 * ✔️ Guardar / Cargar (localStorage)
 *
 * Nota: Este es un demo front-end; el "AgenteIA" usa lógica heurística + ligera aleatoriedad
 * para simular latencia, tokens y costo. Podés reemplazar computeAgenteIA por llamadas a tu backend.
 */

// ===== Utilidades básicas
const genId = () => Math.random().toString(36).slice(2, 9);
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Tamaño de nodo estándar
const NODE_W = 220;
const NODE_H = 100;

// Curva Bézier para cable bonito
function bezierPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.max(60, Math.abs(x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

// Chequea si crear from->to formaría ciclo
function createsCycle(edges: Edge[], from: string, to: string) {
  const adj: Record<string, string[]> = {};
  edges.forEach((e) => {
    (adj[e.from] ||= []).push(e.to);
  });
  const stack = [to];
  const seen = new Set();
  while (stack.length) {
    const n = stack.pop();
    if (!n || seen.has(n)) continue;
    seen.add(n);
    if (n === from) return true;
    (adj[n] || []).forEach((m) => stack.push(m));
  }
  return false;
}

// ===== Tipos de nodo organizados por categoría
const NODE_CATEGORIES = {
  input: [
    { type: "DatasetCSV", label: "Dataset CSV" },
    { type: "InputText", label: "Input Text" },
    { type: "InputNumber", label: "Input Number" },
    { type: "SKU", label: "SKU" },
    { type: "Precios", label: "Precios" },
    { type: "AgenteCostos", label: "Agente Costos" },
  ],
  processing: [
    { type: "Limpiador", label: "Limpiar/Normalizar" },
    { type: "Costos", label: "Análisis de Costos" },
    { type: "Pricing", label: "Generar Precios" },
    { type: "Comparativas", label: "Reporte Comparativas" },
    { type: "Inconsistencias", label: "Detección de Inconsistencias" },
    { type: "AgenteIA", label: "Agente IA" },
    { type: "Concat", label: "Concat" },
    { type: "Sum", label: "Sum" },
  ],
  output: [
    { type: "Reporte", label: "Reporte" },
    { type: "Output", label: "Output" },
  ]
};

// Lista plana para compatibilidad (comentada ya que no se usa)
// const NODE_TYPES = [
//   ...NODE_CATEGORIES.input,
//   ...NODE_CATEGORIES.processing,
//   ...NODE_CATEGORIES.output
// ];

// ===== Reglas de conexión y aridad ===== 
// Nota: NODE_RULES se puede usar para validaciones futuras
// const NODE_RULES: Record<string, { inMin: number; inMax: number; outMin: number; outMax: number }> = {
//   SKU: { inMin: 0, inMax: 0, outMin: 0, outMax: Infinity },
//   Precios: { inMin: 0, inMax: 0, outMin: 0, outMax: Infinity },
//   AgenteCostos: { inMin: 0, inMax: 0, outMin: 0, outMax: Infinity },
//   AgenteIA: { inMin: 2, inMax: 5, outMin: 0, outMax: 1 },
//   Output: { inMin: 1, inMax: 1, outMin: 0, outMax: 0 },
//   Concat: { inMin: 2, inMax: 10, outMin: 0, outMax: Infinity },
//   Sum: { inMin: 2, inMax: 10, outMin: 0, outMax: Infinity },
//   InputText: { inMin: 0, inMax: 0, outMin: 0, outMax: Infinity },
//   InputNumber: { inMin: 0, inMax: 0, outMin: 0, outMax: Infinity },
//   DatasetCSV: { inMin: 0, inMax: 0, outMin: 0, outMax: Infinity },
//   Limpiador: { inMin: 1, inMax: 1, outMin: 0, outMax: Infinity },
//   Costos: { inMin: 1, inMax: 1, outMin: 0, outMax: Infinity },
//   Pricing: { inMin: 1, inMax: 1, outMin: 0, outMax: Infinity },
//   Comparativas: { inMin: 1, inMax: 1, outMin: 0, outMax: Infinity },
//   Inconsistencias: { inMin: 1, inMax: 1, outMin: 0, outMax: Infinity },
//   Reporte: { inMin: 1, inMax: 10, outMin: 0, outMax: Infinity },
// };

const ALLOWED: Record<string, string[]> = {
  SKU: ["AgenteIA", "Concat", "Sum"],
  Precios: ["AgenteIA", "Concat"],
  AgenteCostos: ["AgenteIA"],
  AgenteIA: ["Output"],
  Output: [],
  Concat: ["AgenteIA"],
  Sum: ["AgenteIA"],
  InputText: ["Concat", "AgenteIA"],
  InputNumber: ["Sum", "AgenteIA"],
  DatasetCSV: ["Limpiador", "AgenteIA"],
  Limpiador: ["Costos", "Pricing", "Comparativas", "Inconsistencias", "AgenteIA"],
  Costos: ["Reporte", "AgenteIA"],
  Pricing: ["Reporte", "AgenteIA"],
  Comparativas: ["Reporte", "AgenteIA"],
  Inconsistencias: ["Reporte", "AgenteIA"],
  Reporte: ["Output", "AgenteIA"],
};

// ===== Interfaces TypeScript =====
interface Node {
  id: string;
  type: string;
  x: number;
  y: number;
  data?: Record<string, unknown>;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

interface RunStep {
  nodeId: string;
  status: "pending" | "running" | "done" | "error";
  result?: unknown;
  error?: string;
  startTime?: number;
  endTime?: number;
}

// --- util: parser CSV simple ---
function parseCSV(text: string) {
  if (!text) return [];
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    const o: Record<string, string> = {};
    headers.forEach((h, i) => (o[h] = (cols[i] ?? '').trim()));
    return o;
  });
}

const num = (x: unknown, d = 0) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
};

// ===== Lógica de cómputo =====
function computeNodeValue(type: string, inputs: unknown[], data: Record<string, unknown>, rng: () => number): unknown {
  switch (type) {
    case "SKU":
      return data?.value || "SKU1025";
    case "Precios":
      return data?.value || 150;
    case "AgenteCostos":
      return data?.value || 80;
    case "InputText":
      return data?.value || "";
    case "InputNumber":
      return Number(data?.value) || 0;
    case "Concat":
      return inputs.map(String).join(" ");
    case "Sum":
      return inputs.reduce((a, b) => Number(a) + Number(b), 0);
    case "DatasetCSV": {
      // Prioridad: filas ya parseadas, luego texto pegado, o dataset de ejemplo
      if (Array.isArray(data?.rows) && data.rows.length) return data.rows;
      if (typeof data?.csvText === "string") return parseCSV(data.csvText);
      return [
        { sku: "SKU1025", nombre: "Suero Hidratante Premium", costo: "62", precio_comp1: "118", precio_comp2: "112", precio_comp3: "125", stock: "200" },
        { sku: "SKU1050", nombre: "Crema Antiarrugas Noche", costo: "40", precio_comp1: "79", precio_comp2: "85", precio_comp3: "82", stock: "55" },
        { sku: "SKU1075", nombre: "Limpiador Facial Suave", costo: "25", precio_comp1: "45", precio_comp2: "48", precio_comp3: "42", stock: "150" },
        { sku: "SKU1100", nombre: "Protector Solar FPS 50", costo: "35", precio_comp1: "65", precio_comp2: "68", precio_comp3: "70", stock: "80" },
        { sku: "SKU1125", nombre: "Mascarilla Purificante", costo: "18", precio_comp1: "35", precio_comp2: "38", precio_comp3: "33", stock: "120" },
      ];
    }
    case "Limpiador": {
      const ds = Array.isArray(inputs?.[0]) ? inputs[0] as Record<string, unknown>[] : [];
      return ds.map((r: Record<string, unknown>) => ({
        sku: String(r.sku || r.SKU || "").trim(),
        nombre: String(r.nombre || r.producto || "").trim(),
        costo: num(r.costo ?? r.cost ?? r.costo_unitario, 0),
        stock: num(r.stock, 0),
        precio_comp1: num(r.precio_comp1 ?? r.p1, 0),
        precio_comp2: num(r.precio_comp2 ?? r.p2, 0),
        precio_comp3: num(r.precio_comp3 ?? r.p3, 0),
      }));
    }
    case "Costos": {
      const ds = Array.isArray(inputs?.[0]) ? inputs[0] as Record<string, unknown>[] : [];
      return ds.map((r: Record<string, unknown>) => ({
        sku: r.sku, nombre: r.nombre,
        costo: r.costo,
        costo_total: r.costo, // acá podrías sumar flete/impuestos si quisieras
      }));
    }
    case "Pricing": {
      const ds = Array.isArray(inputs?.[0]) ? inputs[0] as Record<string, unknown>[] : [];
      const markup = clamp(Number(data?.markup ?? 0.25), 0, 1);
      return ds.map((r: Record<string, unknown>) => {
        const comps = [r.precio_comp1, r.precio_comp2, r.precio_comp3].map(Number).filter(Number.isFinite);
        const prom = comps.length ? comps.reduce((a: number, b: number) => a + b, 0) / comps.length : (Number(r.costo) * 1.3);
        const margen_obj = Number(r.costo) * (1 + markup);
        const precio_ref = prom * 0.98;
        let precio_sugerido = Math.max(margen_obj, precio_ref);
        const maxMercado = prom * 1.5;
        if (precio_sugerido > maxMercado) precio_sugerido = maxMercado;
        return { sku: r.sku, nombre: r.nombre, costo: r.costo, base_mercado: +prom.toFixed(2), precio_sugerido: +precio_sugerido.toFixed(2) };
      });
    }
    case "Comparativas": {
      const ds = Array.isArray(inputs?.[0]) ? inputs[0] as Record<string, unknown>[] : [];
      return ds.map((r: Record<string, unknown>) => {
        const comps = [r.precio_comp1, r.precio_comp2, r.precio_comp3].map(Number).filter(Number.isFinite);
        const minComp = comps.length ? Math.min(...comps) : null;
        const maxComp = comps.length ? Math.max(...comps) : null;
        const prom = comps.length ? comps.reduce((a: number, b: number) => a + b, 0) / comps.length : null;
        return { sku: r.sku, nombre: r.nombre, comp_min: minComp, comp_max: maxComp, comp_prom: prom };
      });
    }
    case "Inconsistencias": {
      const ds = Array.isArray(inputs?.[0]) ? inputs[0] as Record<string, unknown>[] : [];
      const seen = new Set<string>();
      return ds.flatMap((r: Record<string, unknown>) => {
        const issues: string[] = [];
        const sku = String(r.sku);
        if (!r.sku) issues.push("SKU vacío");
        if (seen.has(sku)) issues.push("SKU duplicado"); else seen.add(sku);
        if (!(Number(r.costo) > 0)) issues.push("Costo <= 0");
        if (Number(r.stock) < 0) issues.push("Stock negativo");
        const comps = [r.precio_comp1, r.precio_comp2, r.precio_comp3].map(Number).filter(Number.isFinite);
        if (comps.length && Number(r.costo) >= Math.min(...comps)) issues.push("Costo ≥ comp_min (margen nulo)");
        return issues.length ? [{ sku: r.sku, issues }] : [];
      });
    }
    case "Reporte": {
      return inputs.length === 1 ? inputs[0] : inputs;
    }
    case "AgenteIA": {
      // Simulación de IA con guardrails
      const prompt = data?.prompt || "Analizar datos y generar recomendaciones";
      const temp = clamp(Number(data?.temperature) || 0.7, 0, 1);
      const maxTokens = clamp(Number(data?.maxTokens) || 150, 50, 500);
      
      // Simular análisis basado en inputs
      const inputSummary = inputs.map((inp, i) => `Input ${i + 1}: ${JSON.stringify(inp).slice(0, 100)}`).join("; ");
      
      return {
        recommendation: `Basado en el análisis de ${inputs.length} fuentes de datos, se recomienda optimizar precios considerando márgenes del ${Math.round(temp * 100)}% y competencia.`,
        confidence: Math.round(rng() * 40 + 60), // 60-100%
        tokens_used: Math.round(maxTokens * (0.7 + rng() * 0.3)),
        cost_usd: Number((maxTokens * 0.002 * rng()).toFixed(4)),
        input_summary: inputSummary,
        prompt_used: prompt
      };
    }
    case "Output":
      return inputs[0];
    default:
      return null;
  }
}

// helpers
function makeNode(type: string, x: number, y: number, data: Record<string, unknown> = {}) {
  return { id: genId(), type, x, y, data };
}

function connect(from: string, to: string) {
  return { id: genId(), from, to };
}

// presets
function presetPricing(setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setRunLog: React.Dispatch<React.SetStateAction<string[]>>) {
  const a = makeNode("DatasetCSV", 40, 80);
  const b = makeNode("Limpiador", 300, 80);
  const c = makeNode("Pricing", 560, 80, { markup: 0.25 });
  const d = makeNode("Reporte", 820, 80);
  const out = makeNode("Output", 1080, 80);
  setNodes([a, b, c, d, out]);
  setEdges([connect(a.id, b.id), connect(b.id, c.id), connect(c.id, d.id), connect(d.id, out.id)]);
  setRunLog((l) => [...l, "🧩 Cargado preset: Pricing"]);
}

function presetCostos(setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setRunLog: React.Dispatch<React.SetStateAction<string[]>>) {
  const a = makeNode("DatasetCSV", 40, 80);
  const b = makeNode("Limpiador", 300, 80);
  const c = makeNode("Costos", 560, 80);
  const d = makeNode("Reporte", 820, 80);
  const out = makeNode("Output", 1080, 80);
  setNodes([a, b, c, d, out]);
  setEdges([connect(a.id, b.id), connect(b.id, c.id), connect(c.id, d.id), connect(d.id, out.id)]);
  setRunLog((l) => [...l, "🧩 Cargado preset: Costos"]);
}

function presetComparativas(setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setRunLog: React.Dispatch<React.SetStateAction<string[]>>) {
  const a = makeNode("DatasetCSV", 40, 80);
  const b = makeNode("Limpiador", 300, 80);
  const c = makeNode("Comparativas", 560, 80);
  const d = makeNode("Reporte", 820, 80);
  const out = makeNode("Output", 1080, 80);
  setNodes([a, b, c, d, out]);
  setEdges([connect(a.id, b.id), connect(b.id, c.id), connect(c.id, d.id), connect(d.id, out.id)]);
  setRunLog((l) => [...l, "🧩 Cargado preset: Comparativas"]);
}

function presetInconsistencias(setNodes: React.Dispatch<React.SetStateAction<Node[]>>, setEdges: React.Dispatch<React.SetStateAction<Edge[]>>, setRunLog: React.Dispatch<React.SetStateAction<string[]>>) {
  const a = makeNode("DatasetCSV", 40, 80);
  const b = makeNode("Limpiador", 300, 80);
  const c = makeNode("Inconsistencias", 560, 80);
  const d = makeNode("Reporte", 820, 80);
  const out = makeNode("Output", 1080, 80);
  setNodes([a, b, c, d, out]);
  setEdges([connect(a.id, b.id), connect(b.id, c.id), connect(c.id, d.id), connect(d.id, out.id)]);
  setRunLog((l) => [...l, "🧩 Cargado preset: Inconsistencias"]);
}

export default function PricingV51Page() {
  // Estados principales
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [runSteps, setRunSteps] = useState<RunStep[]>([]);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [dragState, setDragState] = useState<{ nodeId?: string; offset?: { x: number; y: number }; isDragging?: boolean }>({});

  // Referencias
  const canvasRef = useRef<HTMLDivElement>(null);
  const rngRef = useRef(Math.random);

  // Funciones auxiliares
  const getNodeById = (id: string) => nodes.find(n => n.id === id);
  const getNodeInputs = (nodeId: string) => {
    const inputEdges = edges.filter(e => e.to === nodeId);
    return inputEdges.map(e => {
      const step = runSteps.find(s => s.nodeId === e.from);
      return step?.result;
    }).filter(r => r !== undefined);
  };

  // Ejecutar flujo
  const runFlow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunLog([]);
    
    // Ordenamiento topológico simple
    const visited = new Set<string>();
    const order: string[] = [];
    
    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const inputEdges = edges.filter(e => e.to === nodeId);
      inputEdges.forEach(e => visit(e.from));
      order.push(nodeId);
    };
    
    nodes.forEach(n => visit(n.id));
    
    // Inicializar pasos
    const steps: RunStep[] = order.map(nodeId => ({
      nodeId,
      status: "pending"
    }));
    setRunSteps(steps);
    
    // Ejecutar cada paso
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const node = getNodeById(step.nodeId);
      if (!node) continue;
      
      step.status = "running";
      step.startTime = Date.now();
      setRunSteps([...steps]);
      setRunLog(prev => [...prev, `⚡ Ejecutando ${node.type} (${node.id})`]);
      
      await sleep(rnd(500, 1500)); // Simular latencia
      
      try {
        const inputs = getNodeInputs(node.id);
        const result = computeNodeValue(node.type, inputs, node.data || {}, rngRef.current);
        
        step.result = result;
        step.status = "done";
        step.endTime = Date.now();
        setRunLog(prev => [...prev, `✅ ${node.type} completado`]);
      } catch (error) {
        step.error = String(error);
        step.status = "error";
        step.endTime = Date.now();
        setRunLog(prev => [...prev, `❌ Error en ${node.type}: ${error}`]);
      }
      
      setRunSteps([...steps]);
    }
    
    setIsRunning(false);
    setRunLog(prev => [...prev, "🎉 Flujo completado"]);
  };

  // Guardar/Cargar
  const saveFlow = () => {
    const data = { nodes, edges };
    localStorage.setItem("flowBuilder", JSON.stringify(data));
    setRunLog(prev => [...prev, "💾 Flujo guardado"]);
  };

  const loadFlow = () => {
    try {
      const saved = localStorage.getItem("flowBuilder");
      if (saved) {
        const data = JSON.parse(saved);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setRunLog(prev => [...prev, "📂 Flujo cargado"]);
      }
    } catch {
      setRunLog(prev => [...prev, "❌ Error al cargar flujo"]);
    }
  };

  // Limpiar canvas
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setRunSteps([]);
    setRunLog(prev => [...prev, "🧹 Canvas limpiado"]);
  };

  // Añadir nodo
  const addNode = (type: string) => {
    const newNode: Node = {
      id: genId(),
      type,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      data: {}
    };
    setNodes(prev => [...prev, newNode]);
    setRunLog(prev => [...prev, `➕ Añadido nodo ${type}`]);
  };

  // Eliminar nodo
  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
    setRunLog(prev => [...prev, `🗑️ Eliminado nodo ${nodeId}`]);
  };

  // Eliminar conexión
  const deleteEdge = (edgeId: string) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
    setRunLog(prev => [...prev, `🗑️ Eliminada conexión`]);
  };

  // Manejar drag & drop de nodos
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return; // Solo botón izquierdo
    
    const node = getNodeById(nodeId);
    if (!node) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const offset = {
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    };
    
    setDragState({ nodeId, offset, isDragging: true });
    
    // Event listeners globales para el drag de nodos
    const handleGlobalMouseMove = (globalE: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newX = globalE.clientX - rect.left - offset.x;
      const newY = globalE.clientY - rect.top - offset.y;
      
      setNodes(prev => prev.map(n => 
        n.id === nodeId 
          ? { ...n, x: Math.max(0, newX), y: Math.max(0, newY) }
          : n
      ));
    };
    
    const handleGlobalMouseUp = () => {
      setDragState({});
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    e.preventDefault();
  };

  // Sistema de conexiones por clicks
  const [connectionFrom, setConnectionFrom] = useState<string | null>(null);

  const handleNodeConnectionClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!connectionFrom) {
      // Primer click: seleccionar nodo origen
      setConnectionFrom(nodeId);
      setRunLog(prev => [...prev, `🔗 Seleccionado ${getNodeById(nodeId)?.type} como origen. Click en otro nodo para conectar.`]);
    } else if (connectionFrom === nodeId) {
      // Click en el mismo nodo: cancelar
      setConnectionFrom(null);
      setRunLog(prev => [...prev, `❌ Conexión cancelada`]);
    } else {
      // Segundo click: crear conexión
      const fromNode = getNodeById(connectionFrom);
      const toNode = getNodeById(nodeId);
      
      if (fromNode && toNode) {
        // Validar conexión
        const allowed = ALLOWED[fromNode.type] || [];
        if (allowed.includes(toNode.type) && !createsCycle(edges, connectionFrom, nodeId)) {
          const newEdge: Edge = {
            id: genId(),
            from: connectionFrom,
            to: nodeId
          };
          setEdges(prev => [...prev, newEdge]);
          setRunLog(prev => [...prev, `✅ Conectado ${fromNode.type} → ${toNode.type}`]);
        } else {
          setRunLog(prev => [...prev, `❌ Conexión no válida: ${fromNode.type} → ${toNode.type}`]);
        }
      }
      
      setConnectionFrom(null);
    }
  };



  return (
    <>
      <Header title="Pricing v 5.1 - Flow Builder IA" />
      <main className="flex-1 flex flex-col bg-slate-50">
        {/* Toolbar superior */}
        <div className="border-b bg-white p-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800">Flow Builder IA</h2>
            
            {/* Botones de acción */}
            <div className="flex gap-2">
              <button
                onClick={runFlow}
                disabled={isRunning}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? "Ejecutando..." : "▶ Ejecutar"}
              </button>
              <button
                onClick={saveFlow}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                💾 Guardar
              </button>
              <button
                onClick={loadFlow}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                📂 Cargar
              </button>
              <button
                onClick={clearCanvas}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-50"
              >
                🧹 Limpiar
              </button>
            </div>
          </div>

          {/* Presets demo */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Presets demo:</span>
            <button onClick={() => presetPricing(setNodes, setEdges, setRunLog)} className="rounded-xl border px-2 py-1 text-sm hover:bg-slate-50">Pricing</button>
            <button onClick={() => presetCostos(setNodes, setEdges, setRunLog)} className="rounded-xl border px-2 py-1 text-sm hover:bg-slate-50">Costos</button>
            <button onClick={() => presetComparativas(setNodes, setEdges, setRunLog)} className="rounded-xl border px-2 py-1 text-sm hover:bg-slate-50">Comparativas</button>
            <button onClick={() => presetInconsistencias(setNodes, setEdges, setRunLog)} className="rounded-xl border px-2 py-1 text-sm hover:bg-slate-50">Inconsistencias</button>
          </div>
          
          {/* Instrucciones de uso */}
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-800">
              <strong>💡 Cómo usar:</strong>
            </div>
            <div className="text-xs text-blue-700 mt-1 space-y-1">
              <div>• <strong>Mover nodos:</strong> Arrastra cualquier nodo por el canvas</div>
              <div>• <strong>Conectar:</strong> Click en un nodo (aparece &quot;1&quot;), luego click en otro nodo (aparece &quot;2&quot;)</div>
              <div>• <strong>Cancelar conexión:</strong> Click en el mismo nodo origen</div>
              <div>• <strong>Eliminar conexión:</strong> Doble click en cualquier línea</div>
              <div>• <strong>Configurar:</strong> Shift + Click en un nodo para ver sus opciones en el panel</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Panel lateral izquierdo - Nodos disponibles */}
          <div className="w-64 border-r bg-white p-4">
            <h3 className="mb-4 font-semibold text-slate-800">Nodos Disponibles</h3>
            
            {/* Nodos de Input */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold text-green-700 uppercase tracking-wide">📥 Input</h4>
              <div className="space-y-1">
                {NODE_CATEGORIES.input.map(nodeType => (
                  <button
                    key={nodeType.type}
                    onClick={() => addNode(nodeType.type)}
                    className="w-full rounded-lg border border-green-200 bg-green-50 p-2 text-left text-sm hover:bg-green-100 hover:border-green-300"
                  >
                    {nodeType.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nodos de Procesamiento */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold text-blue-700 uppercase tracking-wide">⚙️ Procesamiento</h4>
              <div className="space-y-1">
                {NODE_CATEGORIES.processing.map(nodeType => (
                  <button
                    key={nodeType.type}
                    onClick={() => addNode(nodeType.type)}
                    className="w-full rounded-lg border border-blue-200 bg-blue-50 p-2 text-left text-sm hover:bg-blue-100 hover:border-blue-300"
                  >
                    {nodeType.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nodos de Output */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-semibold text-purple-700 uppercase tracking-wide">📤 Output</h4>
              <div className="space-y-1">
                {NODE_CATEGORIES.output.map(nodeType => (
                  <button
                    key={nodeType.type}
                    onClick={() => addNode(nodeType.type)}
                    className="w-full rounded-lg border border-purple-200 bg-purple-50 p-2 text-left text-sm hover:bg-purple-100 hover:border-purple-300"
                  >
                    {nodeType.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas principal */}
          <div className="flex-1 relative overflow-hidden">
            <div
              ref={canvasRef}
              className="absolute inset-0 bg-slate-100 cursor-default"
              style={{
                backgroundImage: `
                  radial-gradient(circle, #cbd5e1 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px"
              }}
            >
              {/* SVG para conexiones */}
              <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                {/* Conexiones existentes */}
                {edges.map(edge => {
                  const fromNode = getNodeById(edge.from);
                  const toNode = getNodeById(edge.to);
                  if (!fromNode || !toNode) return null;
                  
                  const x1 = fromNode.x + NODE_W;
                  const y1 = fromNode.y + NODE_H / 2;
                  const x2 = toNode.x;
                  const y2 = toNode.y + NODE_H / 2;
                  
                  return (
                    <g key={edge.id}>
                      {/* Línea invisible más gruesa para facilitar el click */}
                      <path
                        d={bezierPath(x1, y1, x2, y2)}
                        stroke="transparent"
                        strokeWidth="12"
                        fill="none"
                        className="cursor-pointer"
                        style={{ pointerEvents: "all" }}
                        onDoubleClick={() => deleteEdge(edge.id)}
                      >
                        <title>Doble click para eliminar conexión</title>
                      </path>
                      {/* Línea visible */}
                      <path
                        d={bezierPath(x1, y1, x2, y2)}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        fill="none"
                        className="hover:stroke-red-500 transition-colors"
                        style={{ pointerEvents: "none" }}
                      />
                    </g>
                  );
                })}
                

              </svg>

              {/* Nodos */}
              {nodes.map(node => {
                const step = runSteps.find(s => s.nodeId === node.id);
                const isSelected = selectedNode?.id === node.id;
                const isNodeConnecting = connectionFrom === node.id;
                const isTargetForConnection = connectionFrom && connectionFrom !== node.id;
                
                let statusColor = "bg-white border-slate-300";
                if (step?.status === "running") statusColor = "bg-yellow-100 border-yellow-400";
                if (step?.status === "done") statusColor = "bg-green-100 border-green-400";
                if (step?.status === "error") statusColor = "bg-red-100 border-red-400";
                
                return (
                  <div
                    key={node.id}
                    className={`absolute rounded-lg border-2 p-3 shadow-sm select-none transition-all ${statusColor} ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    } ${isNodeConnecting ? "ring-2 ring-orange-400" : ""} ${
                      isTargetForConnection ? "ring-2 ring-green-400 animate-pulse" : ""
                    } ${
                      dragState.isDragging && dragState.nodeId === node.id ? "cursor-grabbing" : "cursor-grab"
                    }`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: NODE_W,
                      height: NODE_H,
                      zIndex: dragState.isDragging && dragState.nodeId === node.id ? 10 : 2
                    }}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    onClick={(e) => {
                      if (!dragState.isDragging) {
                        if (e.shiftKey) {
                          // Shift + Click para seleccionar sin conectar
                          setSelectedNode(node);
                          setRunLog(prev => [...prev, `🔧 Seleccionado ${node.type} para configuración`]);
                        } else {
                          // Click normal para conectar
                          handleNodeConnectionClick(node.id, e);
                        }
                      }
                    }}
                  >
                    {/* Header del nodo */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-slate-800">{node.type}</span>
                      <button
                        onClick={() => deleteNode(node.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Contenido del nodo */}
                    <div className="text-xs text-slate-600">
                      {step?.status === "done" && (
                        <div className="truncate">
                          ✅ {typeof step.result === "object" ? "Datos procesados" : String(step.result)}
                        </div>
                      )}
                      {step?.status === "error" && (
                        <div className="text-red-600 truncate">❌ {step.error}</div>
                      )}
                      {!step && <div className="text-slate-400">Listo para ejecutar</div>}
                    </div>
                    
                    {/* Indicadores de estado de conexión */}
                    {isNodeConnecting && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                    )}
                    {isTargetForConnection && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                        2
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel lateral derecho - Inspector */}
          <div className="w-80 border-l bg-white p-4">
            <h3 className="mb-4 font-semibold text-slate-800">Inspector</h3>
            
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tipo de Nodo
                  </label>
                  <div className="text-lg font-semibold text-slate-900">{selectedNode.type}</div>
                </div>
                
                {/* Configuración específica por tipo de nodo */}
                {selectedNode.type === "DatasetCSV" && (
                  <div className="space-y-2">
                    <label className="block text-sm">Pegar CSV (cabeceras en la 1ª fila)</label>
                    <textarea
                      rows={6}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      value={String(selectedNode.data?.csvText || "")}
                      onChange={(e) => {
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, csvText: e.target.value } };
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                        setSelectedNode(updatedNode);
                      }}
                      placeholder={"sku,nombre,costo,precio_comp1,precio_comp2,precio_comp3,stock\nSKU1025,Suero Hidratante Premium,62,118,112,125,200\nSKU1050,Crema Antiarrugas Noche,40,79,85,82,55"}
                    />
                    <label className="block text-sm">o subir archivo</label>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={(ev) => {
                        const f = (ev.target.files && ev.target.files[0]) || null;
                        if (!f) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          try {
                            const text = String(reader.result || "");
                            const rows = parseCSV(text);
                            const updatedNode = { ...selectedNode, data: { ...selectedNode.data, rows, csvText: text } };
                            setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                            setSelectedNode(updatedNode);
                          } catch {}
                        };
                        reader.readAsText(f);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                    />
                  </div>
                )}
                
                {selectedNode.type === "Pricing" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Markup (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round((Number(selectedNode.data?.markup) || 0.25) * 100)}
                      onChange={(e) => {
                        const markup = Number(e.target.value) / 100;
                        const updatedNode = { ...selectedNode, data: { ...selectedNode.data, markup } };
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                        setSelectedNode(updatedNode);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                    />
                  </div>
                )}
                
                {selectedNode.type === "AgenteIA" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Prompt
                      </label>
                      <textarea
                        rows={3}
                        value={String(selectedNode.data?.prompt || "Analizar datos y generar recomendaciones")}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, data: { ...selectedNode.data, prompt: e.target.value } };
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                          setSelectedNode(updatedNode);
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Temperatura: {Number(selectedNode.data?.temperature) || 0.7}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={Number(selectedNode.data?.temperature) || 0.7}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, data: { ...selectedNode.data, temperature: Number(e.target.value) } };
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                          setSelectedNode(updatedNode);
                        }}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="500"
                        step="10"
                        value={Number(selectedNode.data?.maxTokens) || 150}
                        onChange={(e) => {
                          const updatedNode = { ...selectedNode, data: { ...selectedNode.data, maxTokens: Number(e.target.value) } };
                          setNodes(prev => prev.map(n => n.id === selectedNode.id ? updatedNode : n));
                          setSelectedNode(updatedNode);
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                      />
                    </div>
                  </div>
                )}
                
                {/* Mostrar resultado si existe */}
                {(() => {
                  const step = runSteps.find(s => s.nodeId === selectedNode.id);
                  if (step?.result) {
                    return (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Resultado
                        </label>
                        <pre className="text-xs bg-slate-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(step.result, null, 2)}
                        </pre>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ) : (
              <div className="text-slate-500 text-sm">
                Selecciona un nodo para ver sus propiedades
              </div>
            )}
            
            {/* Log de ejecución */}
            <div className="mt-8">
              <h4 className="font-semibold text-slate-800 mb-2">Log de Ejecución</h4>
              <div className="bg-slate-100 rounded-lg p-3 h-40 overflow-y-auto text-xs">
                {runLog.map((entry, i) => (
                  <div key={i} className="mb-1">{entry}</div>
                ))}
                {runLog.length === 0 && (
                  <div className="text-slate-500">El log aparecerá aquí...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
