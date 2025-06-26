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
  Factory,
  Download,
  RefreshCw,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import costosData from "../../data/costos.json";

interface CostoItem {
  id: string;
  insumo: string;
  costo_actual: number;
  variacion_esperada: number;
  impacto_operativo: string;
  mensaje_ia: string;
}

const analysisSteps = [
  { 
    text: "🔄 Consultando proveedores y precios históricos...", 
    icon: Factory, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 15,
    duration: 4000
  },
  { 
    text: "🔍 Analizando consumo de materias primas...", 
    icon: Package, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 30,
    duration: 4500
  },
  { 
    text: "📊 Calculando costos logísticos y de operación...", 
    icon: Truck, 
    bgColor: "bg-orange-600", 
    iconColor: "text-white",
    progress: 50,
    duration: 4000
  },
  { 
    text: "⏱️ Estimando impacto de inflación y proyecciones...", 
    icon: TrendingUp, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 70,
    duration: 4500
  },
  { 
    text: "🤖 Generando análisis inteligente de costos...", 
    icon: Bot, 
    bgColor: "bg-slate-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 4000
  },
];

export function Costos() {
  const [selectedCategoria, setSelectedCategoria] = useState("todos");
  const [rangoTemporal, setRangoTemporal] = useState("3-meses");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CostoItem[] | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalizar = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setShowMessages(false);
    setCurrentStep(0);
    setProgress(0);

    // Simulate analysis steps (20-25 seconds total)
    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        // Usar los datos del JSON importado
        setResult(costosData as CostoItem[]);
        setLoading(false);
        
        // Show messages after 2 seconds
        setTimeout(() => setShowMessages(true), 2000);
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
    };

    stepRunner(0);
  };

  const getVariationIcon = (variacion: number) => {
    return variacion > 0 ? 
      <TrendingUp className="h-4 w-4 text-red-500" /> : 
      <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-orange-600 to-orange-700">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Análisis Inteligente de Costos
          </CardTitle>
          <p className="text-orange-100 text-lg">
            Evaluación detallada de costos actuales, históricos y proyectados
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
                  <SelectItem value="todos">📦 Todos los insumos</SelectItem>
                  <SelectItem value="materia-prima">🏭 Materias primas</SelectItem>
                  <SelectItem value="servicios">🚛 Servicios</SelectItem>
                  <SelectItem value="energia">⚡ Energía</SelectItem>
                  <SelectItem value="materiales">🔧 Materiales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Rango Temporal:</label>
              <Select value={rangoTemporal} onValueChange={setRangoTemporal} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-orange-500">
                  <SelectValue placeholder="Selecciona el rango" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-meses">📅 Últimos 3 meses</SelectItem>
                  <SelectItem value="6-meses">📅 Últimos 6 meses</SelectItem>
                  <SelectItem value="año-actual">📅 Año actual</SelectItem>
                  <SelectItem value="12-meses">📅 Últimos 12 meses</SelectItem>
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
              <Search className="h-5 w-5 mr-2" />
              Ejecutar Análisis
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
                    <span>Proveedores</span>
                    <span>Materias Primas</span>
                    <span>Logística</span>
                    <span>Proyecciones</span>
                  </div>
                </div>

                {/* Time Estimation */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-slate-300 text-sm">
                    Tiempo estimado: ~22 segundos
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
                        Procesando datos de costos en tiempo real...
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
                    Rango: {rangoTemporal} | Insumos: {result.length} analizados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Análisis Comparativo de Costos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Insumo</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Costo Actual</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Variación</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Impacto</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Recomendación IA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item, index) => (
                      <tr key={item.id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-slate-800">{item.id}</div>
                            <div className="text-sm text-slate-600">{item.insumo}</div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-900">${item.costo_actual}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getVariationIcon(item.variacion_esperada)}
                            <span className={`font-semibold ${item.variacion_esperada > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.variacion_esperada > 0 ? '+' : ''}{item.variacion_esperada}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600">{item.impacto_operativo}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-600 italic">{item.mensaje_ia}</span>
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
                🔎 Análisis completado de {result.length} insumos. Se detectaron {result.filter(r => r.variacion_esperada > 3).length} elementos con variaciones significativas que requieren atención prioritaria.
              </p>
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h4 className="font-semibold text-orange-100 mb-4 text-lg">Acciones Recomendadas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Revisar contratos con proveedores críticos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Evaluar proveedores alternativos</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Negociar descuentos por volumen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Considerar compras anticipadas</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simulated Messages */}
          {showMessages && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp Simulation */}
              <Card className="border-none shadow-lg bg-green-50 border-green-200">
                <CardHeader className="bg-green-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    WhatsApp (simulado)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-sm">
                    <div className="text-sm font-semibold text-green-700 mb-2">📲 Agente de Costos</div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p>Hola equipo!</p>
                      <p>✅ Análisis de {result.length} insumos completado</p>
                      <p>⚠️ {result.filter(r => r.variacion_esperada > 3).length} insumos con variaciones altas</p>
                      <p>📊 Total costos monitoreados: ${result.reduce((total, item) => total + item.costo_actual, 0).toLocaleString()}</p>
                      <p>💡 Revisar proveedores críticos urgente</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Simulation */}
              <Card className="border-none shadow-lg bg-blue-50 border-blue-200">
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-6 w-6" />
                    Email (simulado)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-300 shadow-sm">
                    <div className="text-sm font-semibold text-blue-700 mb-2">
                      Asunto: Análisis de costos completado – {new Date().toLocaleDateString()}
                    </div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p>Estimado equipo,</p>
                      <p>Se completó el análisis de {result.length} insumos con los siguientes resultados:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Insumos analizados: {result.length}</li>
                        <li>Con variaciones altas: {result.filter(r => r.variacion_esperada > 3).length}</li>
                        <li>Impacto operativo alto: {result.filter(r => r.impacto_operativo.includes('Alto')).length}</li>
                        <li>Requerirán seguimiento: {result.filter(r => r.variacion_esperada > 2).length}</li>
                      </ul>
                      <p>📋 <strong>Acción:</strong> Revisar proveedores de insumos críticos</p>
                      <p className="mt-3">Saludos,<br/>Agente de Costos – Empliados IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Exportar Informe
            </Button>
            <Button variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold px-8 py-3">
              <Phone className="h-5 w-5 mr-2" />
              Contactar Proveedores
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
    </div>
  );
} 