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
  Navigation
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    observaciones: "Entrega completa sin incidentes"
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
    observaciones: "Demora por tráfico en acceso"
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
    observaciones: "Entrega anticipada"
  }
];

const monitoringSteps = [
  { 
    text: "🔄 Iniciando monitoreo de unidad...", 
    icon: Truck, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 15,
    duration: 3000
  },
  { 
    text: "📍 Consultando ubicación GPS actual...", 
    icon: MapPin, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 30,
    duration: 3500
  },
  { 
    text: "📲 Enviando solicitud vía WhatsApp...", 
    icon: MessageCircle, 
    bgColor: "bg-emerald-600", 
    iconColor: "text-white",
    progress: 50,
    duration: 4000
  },
  { 
    text: "📸 Procesando foto de papeleta...", 
    icon: Camera, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 70,
    duration: 3500
  },
  { 
    text: "🤖 Generando análisis de ruta...", 
    icon: Bot, 
    bgColor: "bg-slate-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 3000
  },
];

export function LogisticaDemo() {
  const [selectedUnidad, setSelectedUnidad] = useState("3045");
  const [tipoCarga, setTipoCarga] = useState("nafta");
  const [rutaSeleccionada, setRutaSeleccionada] = useState("rosario-cordoba");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<RegistroLogistica[] | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState(0);
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIniciarMonitoreo = async () => {
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
        // Filter results based on selected unit
        const filteredResults = selectedUnidad === "todas" 
          ? mockLogisticaData 
          : mockLogisticaData.filter(item => item.unidad === selectedUnidad);
        
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
            Agente de Logística Inteligente
          </CardTitle>
          <p className="text-blue-100 text-lg">
            Monitoreo y seguimiento de vehículos con WhatsApp integrado
          </p>
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
                  <SelectItem value="3045">🚛 Unidad 3045</SelectItem>
                  <SelectItem value="2187">🚚 Unidad 2187</SelectItem>
                  <SelectItem value="4521">🚐 Unidad 4521</SelectItem>
                  <SelectItem value="todas">📦 Todas las unidades</SelectItem>
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
                  <SelectItem value="nafta">⛽ Nafta</SelectItem>
                  <SelectItem value="gasoil">🛢️ Gasoil</SelectItem>
                  <SelectItem value="diesel">🚗 Diesel</SelectItem>
                  <SelectItem value="gas">🔥 Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Ruta:</label>
              <Select value={rutaSeleccionada} onValueChange={setRutaSeleccionada} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500">
                  <SelectValue placeholder="Selecciona ruta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rosario-cordoba">🗺️ Rosario - Córdoba</SelectItem>
                  <SelectItem value="bsas-laplata">🏙️ Buenos Aires - La Plata</SelectItem>
                  <SelectItem value="mendoza-sanjuan">🏔️ Mendoza - San Juan</SelectItem>
                  <SelectItem value="custom">📍 Ruta personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleIniciarMonitoreo} 
              disabled={loading}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
              size="lg"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Iniciar Monitoreo
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
                  <h3 className="text-2xl font-bold text-white">Monitoreo en Progreso</h3>
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
                    <span>Foto</span>
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
                        Coordinando con transportista en tiempo real...
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
          {/* Success Step */}
          <Card className="border-none shadow-lg bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-green-600">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Monitoreo completado exitosamente
                  </h3>
                  <p className="text-slate-600 text-lg">
                    Unidad: {selectedUnidad} | Registros: {result.length} procesados
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
                      <th className="text-left p-4 font-semibold text-slate-700">Fecha</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Hora Llegada</th>
                      <th className="text-left p-4 font-semibold text-slate-700">KM</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Carga</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Demora</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item, index) => (
                      <tr key={`${item.unidad}-${item.fecha}`} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="p-4 font-semibold text-blue-600">{item.unidad}</td>
                        <td className="p-4 text-slate-700">{item.fecha}</td>
                        <td className="p-4 font-semibold text-slate-900">{item.hora_llegada}</td>
                        <td className="p-4 text-slate-700">{item.km_final.toLocaleString()}</td>
                        <td className="p-4 text-slate-700">{item.tipo_carga}</td>
                        <td className="p-4">
                          <span className={`font-semibold ${getDemoraColor(item.demora_minutos)}`}>
                            {item.demora_minutos} min
                          </span>
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
                🔍 La unidad {result[0].unidad} registra demoras de {result[0].demora_minutos} minutos promedio. 
                {result[0].demora_minutos > 15 ? ' Se sugiere revisar tiempos en la ruta ' + result[0].ruta + '.' : ' Los tiempos están dentro del rango esperado.'}
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
                      <span>Revisar horarios de carga</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Capacitar conductores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Monitorear combustible</span>
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
                      <p>Resumen de viaje unidad {result[0].unidad}:</p>
                      <p>✅ Llegada: {result[0].hora_llegada}</p>
                      <p>📍 KM: {result[0].km_final.toLocaleString()}</p>
                      <p>⏱️ Demora: {result[0].demora_minutos} min</p>
                      <p>🔋 Combustible: {result[0].combustible_litros}L</p>
                      <p>Todo en orden!</p>
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
                      Asunto: Reporte de viaje - Unidad {result[0].unidad}
                    </div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p>Estimado Supervisor,</p>
                      <p>Adjunto el reporte del viaje completado:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Unidad: {result[0].unidad}</li>
                        <li>Ruta: {result[0].ruta}</li>
                        <li>Hora llegada: {result[0].hora_llegada}</li>
                        <li>Kilometraje: {result[0].km_final.toLocaleString()} km</li>
                        <li>Estado: {result[0].estado} Completado</li>
                      </ul>
                      <p>📋 <strong>Observaciones:</strong> {result[0].observaciones}</p>
                      <p className="mt-3">Saludos,<br/>Agente de Logística – Empleados IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Enviar Reporte al Supervisor
            </Button>
            <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-3">
              <FileText className="h-5 w-5 mr-2" />
              Ver Hoja de Ruta
            </Button>
            <Button variant="outline" className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 font-semibold px-8 py-3">
              <RefreshCw className="h-5 w-5 mr-2" />
              Nuevo Monitoreo
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
                <h3 className="text-xl font-semibold text-red-900">Error en el monitoreo</h3>
                <p className="text-red-700 text-lg">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 