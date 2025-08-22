"use client";

import { useState, createElement } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  CheckCircle2, 
  AlertTriangle,
  Truck,
  MapPin,
  Camera,
  MessageCircle,
  Mail,
  Download,
  RefreshCw,
  FileText,
  Navigation,
  ImageIcon,
  XCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";

interface RegistroLogistica {
  unidad: string;
  fecha: string;
  hora_llegada: string;
  km_inicial: number;
  km_final: number;
  tipo_carga: string;
  ruta: string;
  estado: "✅" | "⚠️" | "❌";
  demora_minutos: number;
  combustible_litros: number;
  observaciones: string;
  boleta_imagen: boolean;
  conductor: string;
}

const mockLogisticaData: RegistroLogistica[] = [
  {
    unidad: "3045",
    fecha: "22/06/2024",
    hora_llegada: "14:23",
    km_inicial: 32400,
    km_final: 32450,
    tipo_carga: "Nafta",
    ruta: "Rosario - Córdoba",
    estado: "✅",
    demora_minutos: 12,
    combustible_litros: 85,
    observaciones: "Entrega completa sin incidentes",
    boleta_imagen: true,
    conductor: "Juan Pérez"
  },
  {
    unidad: "2187",
    fecha: "22/06/2024", 
    hora_llegada: "16:45",
    km_inicial: 45200,
    km_final: 45380,
    tipo_carga: "Gasoil",
    ruta: "Buenos Aires - La Plata",
    estado: "⚠️",
    demora_minutos: 25,
    combustible_litros: 120,
    observaciones: "Demora por tráfico en acceso",
    boleta_imagen: true,
    conductor: "Carlos Rodríguez"
  },
  {
    unidad: "4521",
    fecha: "21/06/2024",
    hora_llegada: "09:15",
    km_inicial: 28900,
    km_final: 29150,
    tipo_carga: "Diesel",
    ruta: "Mendoza - San Juan",
    estado: "✅",
    demora_minutos: 5,
    combustible_litros: 95,
    observaciones: "Entrega anticipada",
    boleta_imagen: true,
    conductor: "Miguel Torres"
  },
  {
    unidad: "1892",
    fecha: "21/06/2024",
    hora_llegada: "11:30",
    km_inicial: 67800,
    km_final: 68120,
    tipo_carga: "Gas",
    ruta: "Tucumán - Salta",
    estado: "✅",
    demora_minutos: 8,
    combustible_litros: 110,
    observaciones: "Entrega normal, documentación completa",
    boleta_imagen: true,
    conductor: "Eduardo Silva"
  },
  {
    unidad: "5643",
    fecha: "21/06/2024",
    hora_llegada: "15:50",
    km_inicial: 23450,
    km_final: 23680,
    tipo_carga: "Nafta",
    ruta: "Santa Fe - Paraná",
    estado: "⚠️",
    demora_minutos: 18,
    combustible_litros: 78,
    observaciones: "Retraso por control policial rutinario",
    boleta_imagen: false,
    conductor: "Roberto Martín"
  },
  {
    unidad: "7234",
    fecha: "20/06/2024",
    hora_llegada: "13:45",
    km_inicial: 89200,
    km_final: 89580,
    tipo_carga: "Diesel",
    ruta: "Neuquén - Bahía Blanca",
    estado: "✅",
    demora_minutos: 3,
    combustible_litros: 140,
    observaciones: "Viaje completado según cronograma",
    boleta_imagen: true,
    conductor: "Fernando López"
  },
  {
    unidad: "9876",
    fecha: "20/06/2024",
    hora_llegada: "08:20",
    km_inicial: 45670,
    km_final: 45890,
    tipo_carga: "Gasoil",
    ruta: "Mar del Plata - Tandil",
    estado: "❌",
    demora_minutos: 45,
    combustible_litros: 92,
    observaciones: "Incidente mecánico menor, reparado en ruta",
    boleta_imagen: false,
    conductor: "Alejandro Vega"
  },
  {
    unidad: "3621",
    fecha: "20/06/2024",
    hora_llegada: "17:10",
    km_inicial: 12340,
    km_final: 12590,
    tipo_carga: "Gas",
    ruta: "Córdoba - Villa María",
    estado: "✅",
    demora_minutos: 10,
    combustible_litros: 88,
    observaciones: "Entrega exitosa, cliente satisfecho",
    boleta_imagen: true,
    conductor: "Gustavo Herrera"
  },
  {
    unidad: "8451",
    fecha: "19/06/2024",
    hora_llegada: "12:35",
    km_inicial: 78900,
    km_final: 79200,
    tipo_carga: "Nafta",
    ruta: "Río Gallegos - Calafate",
    estado: "⚠️",
    demora_minutos: 30,
    combustible_litros: 135,
    observaciones: "Condiciones climáticas adversas",
    boleta_imagen: true,
    conductor: "Diego Morales"
  },
  {
    unidad: "6789",
    fecha: "19/06/2024",
    hora_llegada: "10:45",
    km_inicial: 34500,
    km_final: 34820,
    tipo_carga: "Diesel",
    ruta: "Resistencia - Corrientes",
    estado: "✅",
    demora_minutos: 7,
    combustible_litros: 105,
    observaciones: "Ruta despejada, tiempo óptimo",
    boleta_imagen: false,
    conductor: "Marcelo Ramírez"
  },
  {
    unidad: "1256",
    fecha: "19/06/2024",
    hora_llegada: "14:15",
    km_inicial: 56780,
    km_final: 57020,
    tipo_carga: "Gasoil",
    ruta: "Ushuaia - Río Grande",
    estado: "✅",
    demora_minutos: 12,
    combustible_litros: 98,
    observaciones: "Entrega en tiempo y forma",
    boleta_imagen: true,
    conductor: "Sebastián Castro"
  },
  {
    unidad: "4567",
    fecha: "18/06/2024",
    hora_llegada: "16:30",
    km_inicial: 23450,
    km_final: 23780,
    tipo_carga: "Gas",
    ruta: "San Luis - Villa Mercedes",
    estado: "⚠️",
    demora_minutos: 22,
    combustible_litros: 87,
    observaciones: "Espera prolongada en destino por descarga",
    boleta_imagen: false,
    conductor: "Raúl Jiménez"
  },
  {
    unidad: "7890",
    fecha: "18/06/2024",
    hora_llegada: "09:50",
    km_inicial: 65400,
    km_final: 65720,
    tipo_carga: "Nafta",
    ruta: "Formosa - Clorinda",
    estado: "✅",
    demora_minutos: 5,
    combustible_litros: 82,
    observaciones: "Entrega perfecta, documentación OK",
    boleta_imagen: true,
    conductor: "Jorge González"
  },
  {
    unidad: "2468",
    fecha: "18/06/2024",
    hora_llegada: "18:20",
    km_inicial: 87650,
    km_final: 87980,
    tipo_carga: "Diesel",
    ruta: "Comodoro Rivadavia - Puerto Madryn",
    estado: "❌",
    demora_minutos: 55,
    combustible_litros: 145,
    observaciones: "Falla en sistema de carga, resuelto",
    boleta_imagen: false,
    conductor: "Pablo Fernández"
  },
  {
    unidad: "1357",
    fecha: "17/06/2024",
    hora_llegada: "11:25",
    km_inicial: 43210,
    km_final: 43480,
    tipo_carga: "Gasoil",
    ruta: "Posadas - Puerto Iguazú",
    estado: "✅",
    demora_minutos: 9,
    combustible_litros: 95,
    observaciones: "Viaje sin novedades",
    boleta_imagen: true,
    conductor: "Nicolás Ruiz"
  },
  {
    unidad: "9753",
    fecha: "17/06/2024",
    hora_llegada: "15:40",
    km_inicial: 76540,
    km_final: 76890,
    tipo_carga: "Gas",
    ruta: "Catamarca - La Rioja",
    estado: "⚠️",
    demora_minutos: 15,
    combustible_litros: 108,
    observaciones: "Retraso menor por documentación",
    boleta_imagen: false,
    conductor: "Andrés Vargas"
  },
  {
    unidad: "8642",
    fecha: "17/06/2024",
    hora_llegada: "07:30",
    km_inicial: 54320,
    km_final: 54650,
    tipo_carga: "Nafta",
    ruta: "Santiago del Estero - Termas",
    estado: "✅",
    demora_minutos: 4,
    combustible_litros: 75,
    observaciones: "Entrega matutina exitosa",
    boleta_imagen: true,
    conductor: "Emilio Díaz"
  },
  {
    unidad: "3691",
    fecha: "16/06/2024",
    hora_llegada: "13:55",
    km_inicial: 98760,
    km_final: 99100,
    tipo_carga: "Diesel",
    ruta: "Jujuy - La Quiaca",
    estado: "✅",
    demora_minutos: 11,
    combustible_litros: 118,
    observaciones: "Frontera despejada, entrega normal",
    boleta_imagen: true,
    conductor: "Horacio Medina"
  }
];

const monitoringSteps = [
  { 
    text: "🔄 Iniciando análisis de flota...", 
    icon: Truck, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 15,
    duration: 3000
  },
  { 
    text: "📍 Consultando posiciones GPS...", 
    icon: MapPin, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 30,
    duration: 3500
  },
  { 
    text: "📲 Enviando solicitudes vía WhatsApp...", 
    icon: MessageCircle, 
    bgColor: "bg-emerald-600", 
    iconColor: "text-white",
    progress: 50,
    duration: 4000
  },
  { 
    text: "📸 Procesando imágenes de papeletas...", 
    icon: Camera, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 70,
    duration: 3500
  },
  { 
    text: "🤖 Generando análisis completo...", 
    icon: Bot, 
    bgColor: "bg-slate-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 3000
  },
];

export function LogisticaDemo() {
  const [selectedUnidad, setSelectedUnidad] = useState("todas");
  const [tipoCarga, setTipoCarga] = useState("todas");
  const [rutaSeleccionada, setRutaSeleccionada] = useState("todas");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<RegistroLogistica[] | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleEjecutarAnalisis = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowMessages(false);
    setShowWhatsApp(false);
    setWhatsappStep(0);
    setCurrentStep(0);
    setProgress(0);

    // Simulate monitoring steps (17-20 seconds total)
    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= monitoringSteps.length) {
        // Filter results based on selections
        let filteredResults = mockLogisticaData;
        
        if (selectedUnidad !== "todas") {
          filteredResults = filteredResults.filter(item => item.unidad === selectedUnidad);
        }
        
        if (tipoCarga !== "todas") {
          filteredResults = filteredResults.filter(item => 
            item.tipo_carga.toLowerCase() === tipoCarga.toLowerCase()
          );
        }
        
        if (rutaSeleccionada !== "todas") {
          filteredResults = filteredResults.filter(item => 
            item.ruta.toLowerCase().includes(rutaSeleccionada.toLowerCase())
          );
        }

        // If no specific filters, show all data
        if (filteredResults.length === 0 && selectedUnidad === "todas") {
          filteredResults = mockLogisticaData;
        }
        
        setResult(filteredResults);
        setLoading(false);
        
        // Show WhatsApp simulation after 1 second
        setTimeout(() => setShowWhatsApp(true), 1000);
        
        // Show messages after WhatsApp simulation
        setTimeout(() => setShowMessages(true), 8000);
        return;
      }
      
      const currentStepData = monitoringSteps[stepIndex];
      setCurrentStep(stepIndex);
      
      // Animate progress gradually
      const targetProgress = currentStepData.progress;
      const startProgress = stepIndex > 0 ? monitoringSteps[stepIndex - 1].progress : 0;
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
    };

    stepRunner(0);
  };

  const handleWhatsAppNext = () => {
    if (whatsappStep < 3) {
      setWhatsappStep(whatsappStep + 1);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "✅": return "text-green-600 bg-green-50 border-green-200";
      case "⚠️": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "❌": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getDemoraColor = (minutos: number) => {
    if (minutos <= 10) return "text-green-600";
    if (minutos <= 20) return "text-yellow-600";
    return "text-red-600";
  };

  const handleExportPDF = (customName?: string) => {
    if (!result) return;
    const doc = new jsPDF();
    const today = new Date();
    const fecha = today.toLocaleDateString();
    // Título y encabezado
    doc.setFontSize(18);
    doc.text("Informe de Logística – " + fecha, 14, 20);
    doc.setFontSize(12);
    doc.text("Empresa: Empliados", 14, 30);
    doc.text("Usuario: Test", 14, 37);
    // KPIs principales
    doc.setFontSize(14);
    doc.text("Métricas Principales", 14, 50);
    doc.setFontSize(12);
    doc.text(`Total Viajes: ${result.length}`, 14, 58);
    doc.text(`Completados: ${result.filter(item => item.estado === "✅").length}`, 14, 65);
    doc.text(`En Curso: ${result.filter(item => item.estado === "⚠️").length}`, 14, 72);
    doc.text(`KM Totales: ${result.reduce((sum, item) => sum + (item.km_final - item.km_inicial), 0).toLocaleString()}`, 14, 79);
    doc.text(`Demora Promedio: ${Math.round(result.reduce((sum, item) => sum + item.demora_minutos, 0) / result.length)} min`, 14, 86);
    // Alertas
    doc.setFontSize(14);
    doc.text("Alertas y Observaciones", 14, 100);
    doc.setFontSize(12);
    doc.text(`• ${result.filter(item => item.demora_minutos > 20).length} viajes con demoras significativas`, 14, 108);
    doc.text(`• Documentación completa: ${result.filter(item => item.boleta_imagen).length}/${result.length}`, 14, 115);
    // Recomendaciones IA
    doc.setFontSize(14);
    doc.text("Recomendaciones del Agente IA", 14, 130);
    doc.setFontSize(12);
    doc.text(`• Optimizar rutas de distribución`, 14, 138);
    doc.text(`• Completar documentación faltante`, 14, 145);
    doc.text(`• Revisar horarios de carga`, 14, 152);
    doc.text(`• Monitorear consumo de combustible`, 14, 159);
    // Tabla de viajes (página 2)
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Registro Histórico de Viajes", 14, 20);
    doc.setFontSize(10);
    let y = 30;
    result.forEach((item) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${item.unidad} - ${item.conductor} - ${item.fecha} - ${item.ruta}`, 14, y);
      doc.text(`KM: ${item.km_final} | Carga: ${item.tipo_carga} | Demora: ${item.demora_minutos} min | Estado: ${item.estado}`, 14, y + 5);
      y += 12;
    });
    // Guardar PDF
    const defaultName = `informe_logistica_${fecha}.pdf`;
    doc.save(customName || defaultName);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            🚚 Análisis Inteligente de Logística 
          </CardTitle>
          <p className="text-blue-100 text-lg">
            Monitoreo y seguimiento de vehículos con WhatsApp integrado
          </p>
          <div className="mt-6">
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold px-6 py-2">
              <Navigation className="h-5 w-5 mr-2" />
              Ejecutar Análisis
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Section */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Unidad/Camión:</label>
              <Select value={selectedUnidad} onValueChange={setSelectedUnidad} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500">
                  <SelectValue placeholder="Selecciona unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">📦 Todas las unidades</SelectItem>
                  <SelectItem value="3045">🚛 Unidad 3045</SelectItem>
                  <SelectItem value="2187">🚚 Unidad 2187</SelectItem>
                  <SelectItem value="4521">🚐 Unidad 4521</SelectItem>
                  <SelectItem value="1892">🚛 Unidad 1892</SelectItem>
                  <SelectItem value="5643">🚚 Unidad 5643</SelectItem>
                  <SelectItem value="7234">🚐 Unidad 7234</SelectItem>
                  <SelectItem value="9876">🚛 Unidad 9876</SelectItem>
                  <SelectItem value="3621">🚚 Unidad 3621</SelectItem>
                  <SelectItem value="8451">🚐 Unidad 8451</SelectItem>
                  <SelectItem value="6789">🚛 Unidad 6789</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Tipo de Carga:</label>
              <Select value={tipoCarga} onValueChange={setTipoCarga} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500">
                  <SelectValue placeholder="Selecciona carga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">🔄 Todos los tipos</SelectItem>
                  <SelectItem value="nafta">⛽ Nafta</SelectItem>
                  <SelectItem value="gasoil">🛢️ Gasoil</SelectItem>
                  <SelectItem value="diesel">🚗 Diesel</SelectItem>
                  <SelectItem value="gas">🔥 Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Región:</label>
              <Select value={rutaSeleccionada} onValueChange={setRutaSeleccionada} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500">
                  <SelectValue placeholder="Selecciona región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">🗺️ Todas las regiones</SelectItem>
                  <SelectItem value="cordoba">🏙️ Centro (Córdoba)</SelectItem>
                  <SelectItem value="buenos">🏛️ AMBA (Buenos Aires)</SelectItem>
                  <SelectItem value="mendoza">🏔️ Cuyo (Mendoza)</SelectItem>
                  <SelectItem value="tucuman">🌿 NOA (Tucumán)</SelectItem>
                  <SelectItem value="neuquen">❄️ Patagonia (Neuquén)</SelectItem>
                  <SelectItem value="formosa">🌳 NEA (Formosa)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleEjecutarAnalisis} 
              disabled={loading}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
              size="lg"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Ejecutar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Progress */}
      {loading && (
        <div className="space-y-6">
          {/* Modern Progress Bar */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-slate-800 to-slate-900">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Análisis en Progreso</h3>
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
                    <span>Iniciar</span>
                    <span>GPS</span>
                    <span>WhatsApp</span>
                    <span>Boletas</span>
                    <span>Análisis</span>
                  </div>
                </div>

                {/* Time Estimation */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-slate-300 text-sm">
                    Tiempo estimado: ~19 segundos
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="text-slate-300 text-sm">
                    Paso {currentStep + 1} de {monitoringSteps.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Step with Enhanced Design */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className={`${monitoringSteps[currentStep]?.bgColor} p-8`}>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                      {monitoringSteps[currentStep] && 
                        createElement(monitoringSteps[currentStep].icon, {
                          className: `h-12 w-12 ${monitoringSteps[currentStep].iconColor}`
                        })
                      }
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {monitoringSteps[currentStep]?.text}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-white/80 text-lg">
                        {currentStep <= 1 ? "Estableciendo conexiones con la flota..." : 
                         currentStep <= 3 ? "Coordinando con transportistas en tiempo real..." : 
                         "Consolidando información de rutas..."}
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
                    <div className="text-white/60 text-sm">de {monitoringSteps.length.toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
              
              {/* Step details */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">
                      {currentStep < 2 ? "Recopilando datos GPS" : 
                       currentStep < 4 ? "Comunicación WhatsApp activa" : 
                       "Generando reportes automáticos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">
                      Vehículos: {currentStep >= 1 ? `${result?.length || 18} conectados` : "Escaneando flota"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-600">
                      Estado: {currentStep >= 4 ? "Finalizando" : "Procesando"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* WhatsApp Simulation */}
      {showWhatsApp && (
        <Card className="border-none shadow-lg bg-green-50 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              WhatsApp - Comunicación en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Agent Message */}
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-sm max-w-md">
                  <div className="text-sm font-semibold text-green-700 mb-2">📲 Agente Empleados Logística</div>
                  <div className="text-sm text-slate-700">
                    Hola Juan. Por favor envía foto clara de papeleta y KM actual del vehículo. ¡Gracias!
                  </div>
                  <div className="text-xs text-slate-500 mt-2">14:20</div>
                </div>
              </div>

              {/* Driver Response */}
              {whatsappStep >= 1 && (
                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-lg p-4 shadow-sm max-w-md">
                    <div className="text-sm font-semibold mb-2">🧑‍💻 Juan - Transportista</div>
                    <div className="text-sm">
                      📸 Foto enviada<br/>
                      KM: 32,450<br/>
                      Todo en orden!
                    </div>
                    <div className="text-xs text-blue-100 mt-2">14:23</div>
                  </div>
                </div>
              )}

              {/* Agent Confirmation */}
              {whatsappStep >= 2 && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-sm max-w-md">
                    <div className="text-sm font-semibold text-green-700 mb-2">📲 Agente Empleados Logística</div>
                    <div className="text-sm text-slate-700">
                      ✅ Recibido y validado.<br/>
                      Hora: 14:23<br/>
                      Kilometraje: 32,450 km<br/>
                      ¡Gracias!
                    </div>
                    <div className="text-xs text-slate-500 mt-2">14:23</div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {whatsappStep < 2 && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleWhatsAppNext}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {whatsappStep === 0 ? "📸 Enviar Foto" : "✅ Confirmar Recepción"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-none shadow-lg bg-blue-600 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{result.length}</div>
                <div className="text-blue-100 text-sm">Total Viajes</div>
                <div className="text-blue-200 text-xs">Registrados</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-green-600 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {result.filter(item => item.estado === "✅").length}
                </div>
                <div className="text-green-100 text-sm">Completados</div>
                <div className="text-green-200 text-xs">Sin incidentes</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-orange-600 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {result.filter(item => item.estado === "⚠️").length}
                </div>
                <div className="text-orange-100 text-sm">En Curso</div>
                <div className="text-orange-200 text-xs">Activos ahora</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-purple-600 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {Math.round(result.reduce((sum, item) => sum + (item.km_final - item.km_inicial), 0) / result.length)}
                </div>
                <div className="text-purple-100 text-sm">KM Totales</div>
                <div className="text-purple-200 text-xs">Recorridos</div>
              </CardContent>
            </Card>
          </div>

          {/* Success Step */}
          <Card className="border-none shadow-lg bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-green-600">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Análisis completado exitosamente
                  </h3>
                  <p className="text-slate-600 text-lg">
                    {selectedUnidad === "todas" ? "Flota completa" : `Unidad ${selectedUnidad}`} | 
                    {result.length} registros procesados | 
                    {result.filter(item => item.boleta_imagen).length} con boletas verificadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Registro Histórico de Viajes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Unidad</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Conductor</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Fecha</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Hora</th>
                      <th className="text-left p-4 font-semibold text-slate-700">KM</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Carga</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Demora</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Boleta</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item, index) => (
                      <tr key={`${item.unidad}-${item.fecha}-${index}`} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="p-4 font-semibold text-blue-600">{item.unidad}</td>
                        <td className="p-4 text-slate-700 text-sm">{item.conductor}</td>
                        <td className="p-4 text-slate-700 text-sm">{item.fecha}</td>
                        <td className="p-4 font-semibold text-slate-900">{item.hora_llegada}</td>
                        <td className="p-4 text-slate-700">{item.km_final.toLocaleString()}</td>
                        <td className="p-4 text-slate-700">{item.tipo_carga}</td>
                        <td className="p-4">
                          <span className={`font-semibold ${getDemoraColor(item.demora_minutos)}`}>
                            {item.demora_minutos} min
                          </span>
                        </td>
                        <td className="p-4">
                          {item.boleta_imagen ? (
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 text-sm font-medium">✓</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-red-500 text-sm font-medium">✗</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.estado)}`}>
                            {item.estado}
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
          <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Bot className="h-8 w-8" />
                Recomendación del Agente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                🔍 Análisis de {result.length} viajes completado. 
                Promedio de demora: {Math.round(result.reduce((sum, item) => sum + item.demora_minutos, 0) / result.length)} minutos. 
                {result.filter(item => item.boleta_imagen).length} de {result.length} viajes tienen documentación fotográfica completa.
                {result.filter(item => item.demora_minutos > 20).length > 0 ? 
                  ` Se detectaron ${result.filter(item => item.demora_minutos > 20).length} viajes con demoras significativas que requieren atención.` : 
                  ' Todos los tiempos están dentro del rango esperado.'
                }
              </p>
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h4 className="font-semibold text-blue-100 mb-4 text-lg">Acciones Recomendadas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Optimizar rutas de distribución</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Completar documentación faltante</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Revisar horarios de carga</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Capacitar conductores en WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Monitorear consumo de combustible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Implementar alertas automáticas</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulated Messages */}
          {showMessages && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp Final Summary */}
              <Card className="border-none shadow-lg bg-green-50 border-green-200">
                <CardHeader className="bg-green-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    Resumen WhatsApp (automático)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-sm">
                    <div className="text-sm font-semibold text-green-700 mb-2">📲 Agente Logística</div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p>Hola Supervisor.</p>
                      <p>Resumen de análisis de flota:</p>
                      <p>📊 Total viajes: {result.length}</p>
                      <p>✅ Completados: {result.filter(item => item.estado === "✅").length}</p>
                      <p>⚠️ En proceso: {result.filter(item => item.estado === "⚠️").length}</p>
                      <p>📸 Con boletas: {result.filter(item => item.boleta_imagen).length}/{result.length}</p>
                      <p>⏱️ Demora promedio: {Math.round(result.reduce((sum, item) => sum + item.demora_minutos, 0) / result.length)} min</p>
                      <p>🛣️ KM recorridos: {result.reduce((sum, item) => sum + (item.km_final - item.km_inicial), 0).toLocaleString()}</p>
                      <p>Sistema funcionando correctamente!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Simulation */}
              <Card className="border-none shadow-lg bg-blue-50 border-blue-200">
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Reporte Email (automático)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300 shadow-sm">
                    <div className="text-sm font-semibold text-blue-700 mb-2">
                      Asunto: Reporte análisis de flota - {new Date().toLocaleDateString()}
                    </div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p>Estimado Supervisor,</p>
                      <p>Adjunto el reporte del análisis de flota completado:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Total de unidades analizadas: {new Set(result.map(item => item.unidad)).size}</li>
                        <li>Viajes registrados: {result.length}</li>
                        <li>Promedio de demoras: {Math.round(result.reduce((sum, item) => sum + item.demora_minutos, 0) / result.length)} minutos</li>
                        <li>Eficiencia general: {Math.round((result.filter(item => item.estado === "✅").length / result.length) * 100)}%</li>
                        <li>Documentación completa: {Math.round((result.filter(item => item.boleta_imagen).length / result.length) * 100)}%</li>
                      </ul>
                      <p>📋 <strong>Observaciones:</strong> {result.filter(item => item.demora_minutos > 20).length > 0 ? 
                        `${result.filter(item => item.demora_minutos > 20).length} viajes requieren seguimiento por demoras.` : 
                        'Todos los viajes dentro de los tiempos esperados.'}</p>
                      <p className="mt-3">Saludos,<br/>Agente de Logística – Empleados IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="h-5 w-5 mr-2" />
              Descargar Informe
            </Button>
            <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-3">
              <FileText className="h-5 w-5 mr-2" />
              Ver Hoja de Ruta
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

      {/* Modal de Exportación */}
      {showExportModal && (
        <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exportar Informe de Logística a PDF</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del archivo:
                </label>
                <Input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="informe_logistica_2024-01-15.pdf"
                  className="w-full"
                />
              </div>
              <p className="text-sm text-slate-600">
                El PDF incluirá: KPIs principales, tabla completa de viajes, alertas y recomendaciones del agente IA.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => { handleExportPDF(fileName); setShowExportModal(false); }}>
                Exportar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 