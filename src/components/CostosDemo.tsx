"use client";

import { useState, createElement } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Bot, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Download,
  RefreshCw,
  MessageCircle,
  Calculator,
  Warehouse,
  Users,
  X,
  Send,
  Clock,
  FileText,
  Mail
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CostoVenta {
  id: string;
  categoria: string;
  descripcion: string;
  costo_actual: number;
  variacion_esperada: number;
  impacto_margen: string;
  recomendacion_ia: string;
}

// Datos de costos de venta de equipos de computación
const costosVentaData: CostoVenta[] = [
  {
    id: "1",
    categoria: "Adquisición",
    descripcion: "Precio proveedor + Tipo de cambio",
    costo_actual: 850,
    variacion_esperada: 5.2,
    impacto_margen: "Alto",
    recomendacion_ia: "Negociar mejores términos con proveedores asiáticos"
  },
  {
    id: "2",
    categoria: "Adquisición",
    descripcion: "Flete internacional + Seguro",
    costo_actual: 120,
    variacion_esperada: 8.5,
    impacto_margen: "Medio",
    recomendacion_ia: "Consolidar envíos para reducir costos por unidad"
  },
  {
    id: "3",
    categoria: "Adquisición",
    descripcion: "Aranceles + Despachante",
    costo_actual: 180,
    variacion_esperada: 2.1,
    impacto_margen: "Medio",
    recomendacion_ia: "Optimizar declaraciones aduaneras"
  },
  {
    id: "4",
    categoria: "Logística",
    descripcion: "Flete nacional + Embalaje",
    costo_actual: 95,
    variacion_esperada: 4.3,
    impacto_margen: "Bajo",
    recomendacion_ia: "Implementar embalaje optimizado"
  },
  {
    id: "5",
    categoria: "Logística",
    descripcion: "Manipulación y logística interna",
    costo_actual: 65,
    variacion_esperada: 3.8,
    impacto_margen: "Bajo",
    recomendacion_ia: "Automatizar procesos de almacén"
  },
  {
    id: "6",
    categoria: "Almacenamiento",
    descripcion: "Depósito + Seguros locales",
    costo_actual: 45,
    variacion_esperada: 6.2,
    impacto_margen: "Bajo",
    recomendacion_ia: "Optimizar espacio de almacenamiento"
  },
  {
    id: "7",
    categoria: "Almacenamiento",
    descripcion: "Depreciación + Mermas",
    costo_actual: 35,
    variacion_esperada: 1.5,
    impacto_margen: "Medio",
    recomendacion_ia: "Implementar control de inventario más estricto"
  },
  {
    id: "8",
    categoria: "Comercialización",
    descripcion: "Marketing + Comisiones",
    costo_actual: 150,
    variacion_esperada: 7.8,
    impacto_margen: "Alto",
    recomendacion_ia: "Optimizar canales de marketing digital"
  },
  {
    id: "9",
    categoria: "Comercialización",
    descripcion: "Pasarelas + Soporte técnico",
    costo_actual: 85,
    variacion_esperada: 4.6,
    impacto_margen: "Medio",
    recomendacion_ia: "Negociar mejores comisiones con plataformas"
  },
  {
    id: "10",
    categoria: "Financieros",
    descripcion: "Pérdidas tipo de cambio",
    costo_actual: 75,
    variacion_esperada: 12.5,
    impacto_margen: "Alto",
    recomendacion_ia: "Implementar cobertura cambiaria"
  },
  {
    id: "11",
    categoria: "Financieros",
    descripcion: "Costos financieros stock",
    costo_actual: 55,
    variacion_esperada: 3.2,
    impacto_margen: "Medio",
    recomendacion_ia: "Optimizar rotación de inventario"
  },
  {
    id: "12",
    categoria: "Estratégicos",
    descripcion: "Herramientas + Estructura",
    costo_actual: 120,
    variacion_esperada: 5.4,
    impacto_margen: "Medio",
    recomendacion_ia: "Consolidar herramientas tecnológicas"
  }
];

const analysisSteps = [
  { 
    text: "📦 Analizando costos de adquisición y proveedores...", 
    icon: Package, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 15,
    duration: 4000
  },
  { 
    text: "🚚 Evaluando logística nacional e internacional...", 
    icon: Truck, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 30,
    duration: 4500
  },
  { 
    text: "🏢 Calculando almacenamiento y mantenimiento...", 
    icon: Warehouse, 
    bgColor: "bg-orange-600", 
    iconColor: "text-white",
    progress: 45,
    duration: 4000
  },
  { 
    text: "💼 Analizando costos comerciales y administrativos...", 
    icon: Users, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 60,
    duration: 4500
  },
  { 
    text: "⚠️ Evaluando riesgos financieros y cambiarios...", 
    icon: AlertTriangle, 
    bgColor: "bg-red-600", 
    iconColor: "text-white",
    progress: 75,
    duration: 4000
  },
  { 
    text: "🧠 Calculando costos estratégicos y estructurales...", 
    icon: Bot, 
    bgColor: "bg-slate-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 4500
  },
];

export function Costos() {
  const [selectedCategoria, setSelectedCategoria] = useState("todos");
  const [tipoProducto, setTipoProducto] = useState("laptops");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CostoVenta[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showConsultaModal, setShowConsultaModal] = useState(false);
  const [consultaEnviada, setConsultaEnviada] = useState(false);
  const [numeroTicket, setNumeroTicket] = useState<string>("");

  const handleAnalizar = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setTerminalOutput([]);

    // Simulate analysis steps (25-30 seconds total)
    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        setResult(costosVentaData);
        setLoading(false);
        return;
      }
      
      const currentStepData = analysisSteps[stepIndex];
      setCurrentStep(stepIndex);
      
      // Animate progress gradually
      const targetProgress = currentStepData.progress;
      const startProgress = stepIndex > 0 ? analysisSteps[stepIndex - 1].progress : 0;
      const duration = currentStepData.duration;
      const increment = (targetProgress - startProgress) / (duration / 100);
      let currentProgress = startProgress;
      
      const progressTimer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= targetProgress) {
          currentProgress = targetProgress;
          clearInterval(progressTimer);
          setTimeout(() => stepRunner(stepIndex + 1), 600);
        }
        setProgress(Math.min(currentProgress, targetProgress));
      }, 100);

      // Simular procesamiento en terminal
      const terminalMessages = [
        `[${new Date().toLocaleTimeString()}] Iniciando análisis de costos de ${tipoProducto}...`,
        `[${new Date().toLocaleTimeString()}] Consultando proveedores internacionales...`,
        `[${new Date().toLocaleTimeString()}] Calculando tipo de cambio actual: $1 = ¥6.85...`,
        `[${new Date().toLocaleTimeString()}] Procesando costos de flete: $120.00...`,
        `[${new Date().toLocaleTimeString()}] Calculando aranceles: 15.5% sobre $850.00...`,
        `[${new Date().toLocaleTimeString()}] Analizando logística nacional...`,
        `[${new Date().toLocaleTimeString()}] Calculando costos de almacenamiento...`,
        `[${new Date().toLocaleTimeString()}] Evaluando depreciación mensual: 2.1%...`,
        `[${new Date().toLocaleTimeString()}] Procesando costos comerciales...`,
        `[${new Date().toLocaleTimeString()}] Calculando comisiones: 8.5% sobre venta...`,
        `[${new Date().toLocaleTimeString()}] Analizando riesgos cambiarios...`,
        `[${new Date().toLocaleTimeString()}] Pérdida por tipo de cambio: $75.00...`,
        `[${new Date().toLocaleTimeString()}] Calculando costos estructurales...`,
        `[${new Date().toLocaleTimeString()}] Herramientas CRM/ERP: $120.00...`,
        `[${new Date().toLocaleTimeString()}] Análisis completado. Total costos: $1,880.00`
      ];

      // Mostrar mensajes de terminal progresivamente
      terminalMessages.forEach((message, index) => {
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, message]);
        }, index * 150);
      });
    };

    stepRunner(0);
  };

  const getVariationIcon = (variacion: number) => {
    return variacion > 0 ? 
      <TrendingUp className="h-4 w-4 text-red-500" /> : 
      <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case "Alto": return "text-red-600 bg-red-50 border-red-200";
      case "Medio": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Bajo": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const filteredData = selectedCategoria === "todos" 
    ? costosVentaData 
    : costosVentaData.filter(item => item.categoria === selectedCategoria);

  const totalCostos = filteredData.reduce((sum, item) => sum + item.costo_actual, 0);
  const promedioVariacion = filteredData.reduce((sum, item) => sum + item.variacion_esperada, 0) / filteredData.length;

  const handleConsultaAgente = () => {
    setShowConsultaModal(true);
    setConsultaEnviada(false);
    setNumeroTicket("");
  };

  const handleEnviarConsulta = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generar número de ticket
    const ticket = `TKT-${Date.now().toString().slice(-6)}`;
    setNumeroTicket(ticket);
    setConsultaEnviada(true);
    
    // Simular envío al agente
    setTimeout(() => {
      setShowConsultaModal(false);
      setConsultaEnviada(false);
      setNumeroTicket("");
    }, 3000);
  };



  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-orange-600 to-orange-700">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Calculator className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Análisis de Costos de Venta
          </CardTitle>
          <p className="text-orange-100 text-lg">
            Evaluación completa de costos para equipos de computación
          </p>
        </CardHeader>
      </Card>

      {/* Configuration Section */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Categoría de Costos:</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-orange-500">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">📦 Todas las categorías</SelectItem>
                  <SelectItem value="Adquisición">📦 Costos de Adquisición</SelectItem>
                  <SelectItem value="Logística">🚚 Costos Logísticos</SelectItem>
                  <SelectItem value="Almacenamiento">🏢 Almacenamiento</SelectItem>
                  <SelectItem value="Comercialización">💼 Comercialización</SelectItem>
                  <SelectItem value="Financieros">⚠️ Costos Financieros</SelectItem>
                  <SelectItem value="Estratégicos">🧠 Costos Estratégicos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Tipo de Producto:</label>
              <Select value={tipoProducto} onValueChange={setTipoProducto} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-orange-500">
                  <SelectValue placeholder="Selecciona producto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptops">💻 Laptops</SelectItem>
                  <SelectItem value="desktops">🖥️ Desktops</SelectItem>
                  <SelectItem value="servers">🖥️ Servidores</SelectItem>
                  <SelectItem value="peripherals">🖱️ Periféricos</SelectItem>
                  <SelectItem value="networking">🌐 Networking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleAnalizar} 
              disabled={loading}
              className="h-12 px-8 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-lg"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Search className="mr-3 h-6 w-6" />
                  Ejecutar Análisis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {loading && (
        <div className="space-y-6">
          {/* Modern Progress Bar */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-slate-800 to-slate-900">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Análisis de Costos en Progreso</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{Math.round(progress)}%</div>
                      <div className="text-slate-300 text-sm">Completado</div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="space-y-3">
                  <Progress 
                    value={progress} 
                    className="h-4 bg-slate-700 border border-slate-600" 
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Adquisición</span>
                    <span>Logística</span>
                    <span>Almacenamiento</span>
                    <span>Comercialización</span>
                    <span>Financieros</span>
                    <span>Estratégicos</span>
                  </div>
                </div>

                {/* Time Estimation */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-slate-300 text-sm">
                    Tiempo estimado: ~30 segundos
                  </div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <div className="text-slate-300 text-sm">
                    Paso {currentStep + 1} de {analysisSteps.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Step with Enhanced Design */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className={`${analysisSteps[currentStep]?.bgColor} p-8`}>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                      {analysisSteps[currentStep] && 
                        createElement(analysisSteps[currentStep].icon, {
                          className: `h-12 w-12 ${analysisSteps[currentStep].iconColor}`
                        })
                      }
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {analysisSteps[currentStep]?.text}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-white/80 text-lg">
                        Procesando costos de {tipoProducto} en tiempo real...
                      </div>
                      {/* Animated dots */}
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Step counter */}
                  <div className="text-right">
                    <div className="text-white/60 text-sm font-medium">PASO</div>
                    <div className="text-3xl font-bold text-white">
                      {(currentStep + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="text-white/60 text-sm">de {analysisSteps.length.toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminal de Procesamiento */}
          <Card className="border-none shadow-lg bg-black">
            <CardHeader className="bg-slate-900 border-b border-slate-700">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-400" />
                Terminal de Procesamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-black rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm">
                <div className="text-green-400 space-y-1">
                  {terminalOutput.map((message, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">$</span>
                      <span>{message}</span>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 animate-pulse">
                      <span className="text-green-500">$</span>
                      <span className="text-green-400">Procesando...</span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Success Step */}
          <Card className="border-none shadow-lg bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-green-600">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Análisis de costos completado
                  </h3>
                  <p className="text-slate-600 text-lg">
                    Producto: {tipoProducto} | Categoría: {selectedCategoria}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg bg-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">Total Costos</span>
                  <DollarSign className="h-6 w-6 text-blue-200" />
                </div>
                <div className="text-3xl font-bold">${totalCostos.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">Por unidad</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm font-medium">Categorías</span>
                  <Package className="h-6 w-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold">{filteredData.length}</div>
                <div className="text-green-200 text-sm">Analizadas</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-yellow-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-100 text-sm font-medium">Variación Promedio</span>
                  <TrendingUp className="h-6 w-6 text-yellow-200" />
                </div>
                <div className="text-3xl font-bold">{promedioVariacion.toFixed(1)}%</div>
                <div className="text-yellow-200 text-sm">Esperada</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-100 text-sm font-medium">Margen Sugerido</span>
                  <Calculator className="h-6 w-6 text-purple-200" />
                </div>
                <div className="text-3xl font-bold">35%</div>
                <div className="text-purple-200 text-sm">Para rentabilidad</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results Table */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Detalle de Costos por Categoría</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4 text-left font-semibold text-slate-800">Categoría</th>
                      <th className="p-4 text-left font-semibold text-slate-800">Descripción</th>
                      <th className="p-4 text-right font-semibold text-slate-800">Costo Actual</th>
                      <th className="p-4 text-right font-semibold text-slate-800">Variación</th>
                      <th className="p-4 text-center font-semibold text-slate-800">Impacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="p-4 text-slate-700 font-medium">{item.categoria}</td>
                        <td className="p-4 text-slate-700">{item.descripcion}</td>
                        <td className="p-4 text-right text-slate-700 font-semibold">${item.costo_actual.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {getVariationIcon(item.variacion_esperada)}
                            <span className={`font-semibold ${item.variacion_esperada > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.variacion_esperada > 0 ? '+' : ''}{item.variacion_esperada}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getImpactColor(item.impacto_margen)}`}>
                            {item.impacto_margen}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Bot className="h-8 w-8" />
                Recomendación del Agente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-100 text-lg mb-6 leading-relaxed">
                🔎 Análisis completado de {filteredData.length} categorías de costos. Se detectaron {filteredData.filter(r => r.variacion_esperada > 5).length} elementos con variaciones significativas que requieren atención prioritaria.
              </p>
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h4 className="font-semibold text-orange-100 mb-4 text-lg">Acciones Recomendadas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span>Negociar mejores términos con proveedores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span>Implementar cobertura cambiaria</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span>Optimizar logística y almacenamiento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-300" />
                      <span>Revisar estrategias de marketing</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Exportar Análisis
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3"
              onClick={handleConsultaAgente}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consultar con Agente
            </Button>
            <Button variant="outline" className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 font-semibold px-8 py-3">
              <RefreshCw className="h-5 w-5 mr-2" />
              Nuevo Análisis
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-none shadow-lg border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-red-600">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-900">Error en el análisis</h3>
                <p className="text-red-700 text-lg">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Consulta al Agente */}
      {showConsultaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl border-none shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Consultar con Agente de Costos
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowConsultaModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {!consultaEnviada ? (
                <form onSubmit={handleEnviarConsulta} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Categoría de Consulta:
                      </label>
                      <Select name="categoria" required>
                        <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-orange-500">
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Adquisición">📦 Costos de Adquisición</SelectItem>
                          <SelectItem value="Logística">🚚 Costos Logísticos</SelectItem>
                          <SelectItem value="Almacenamiento">🏢 Almacenamiento</SelectItem>
                          <SelectItem value="Comercialización">💼 Comercialización</SelectItem>
                          <SelectItem value="Financieros">⚠️ Costos Financieros</SelectItem>
                          <SelectItem value="Estratégicos">🧠 Costos Estratégicos</SelectItem>
                          <SelectItem value="general">📊 Consulta General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prioridad:
                      </label>
                      <Select name="prioridad" required>
                        <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-orange-500">
                          <SelectValue placeholder="Selecciona prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alta">🔴 Alta - Urgente</SelectItem>
                          <SelectItem value="Media">🟡 Media - Importante</SelectItem>
                          <SelectItem value="Baja">🟢 Baja - Consulta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tu Consulta:
                      </label>
                      <Textarea
                        name="consulta"
                        placeholder="Describe tu consulta específica sobre costos..."
                        className="min-h-[120px] border-2 border-slate-200 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowConsultaModal(false)}
                      className="border-2 border-slate-300 text-slate-600 hover:bg-slate-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Consulta
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="p-4 rounded-full bg-green-100 w-fit mx-auto">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Consulta Enviada Exitosamente
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Tu consulta ha sido enviada al Agente de Costos
                    </p>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Número de Ticket:</span>
                      </div>
                      <div className="text-lg font-bold text-orange-600">{numeroTicket}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Tiempo estimado de respuesta:</span>
                    </div>
                    <div className="text-blue-800 font-semibold">2-4 horas</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Notificaciones:</span>
                    </div>
                    <div className="text-green-800 text-sm">
                      Recibirás confirmación por email y WhatsApp
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 