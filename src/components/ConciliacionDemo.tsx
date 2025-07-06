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
  XCircle,
  CreditCard,
  FileText,
  Calculator,
  Building2,
  Download,
  RefreshCw,
  BarChart3
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import conciliacionData from "@/../data/conciliacion.json";

interface ConciliacionData {
  id: string;
  fecha: string;
  descripcion: string;
  monto_contable: number;
  monto_bancario: number;
  estado: string;
}

const analysisSteps = [
  { 
    text: "📥 Recuperando extractos bancarios...", 
    icon: CreditCard, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 15,
    duration: 3500
  },
  { 
    text: "📋 Consultando registros contables...", 
    icon: FileText, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 30,
    duration: 4000
  },
  { 
    text: "🏛️ Verificando registros fiscales...", 
    icon: Building2, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 45,
    duration: 3500
  },
  { 
    text: "🧮 Comparando movimientos y saldos...", 
    icon: Calculator, 
    bgColor: "bg-orange-600", 
    iconColor: "text-white",
    progress: 65,
    duration: 4500
  },
  { 
    text: "📊 Analizando discrepancias...", 
    icon: BarChart3, 
    bgColor: "bg-red-600", 
    iconColor: "text-white",
    progress: 80,
    duration: 4000
  },
  { 
    text: "✅ Generando reporte de conciliación...", 
    icon: Bot, 
    bgColor: "bg-slate-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 3500
  },
];

export function ConciliacionDemo() {
  const [tipoConciliacion, setTipoConciliacion] = useState("bancaria");
  const [periodo, setPeriodo] = useState("marzo-2025");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConciliacionData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const handleEjecutar = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setTerminalOutput([]);

    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        setLoading(false);
        setResult(conciliacionData);
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
        `[${new Date().toLocaleTimeString()}] Iniciando análisis de ${tipoConciliacion}...`,
        `[${new Date().toLocaleTimeString()}] Cargando registros del período ${periodo}...`,
        `[${new Date().toLocaleTimeString()}] Procesando registro 1/48...`,
        `[${new Date().toLocaleTimeString()}] Procesando registro 15/48...`,
        `[${new Date().toLocaleTimeString()}] Procesando registro 32/48...`,
        `[${new Date().toLocaleTimeString()}] Procesando registro 48/48...`,
        `[${new Date().toLocaleTimeString()}] Calculando diferencias: $150.00...`,
        `[${new Date().toLocaleTimeString()}] Calculando diferencias: $320.50...`,
        `[${new Date().toLocaleTimeString()}] Calculando diferencias: $890.25...`,
        `[${new Date().toLocaleTimeString()}] Validando movimientos bancarios...`,
        `[${new Date().toLocaleTimeString()}] Validando movimientos contables...`,
        `[${new Date().toLocaleTimeString()}] Validando movimientos fiscales...`,
        `[${new Date().toLocaleTimeString()}] Conciliación: 45% completada...`,
        `[${new Date().toLocaleTimeString()}] Conciliación: 67% completada...`,
        `[${new Date().toLocaleTimeString()}] Conciliación: 89% completada...`,
        `[${new Date().toLocaleTimeString()}] Generando reporte final...`,
        `[${new Date().toLocaleTimeString()}] Análisis completado exitosamente.`
      ];

      // Mostrar mensajes de terminal progresivamente
      terminalMessages.forEach((message, index) => {
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, message]);
        }, index * 200);
      });
    };

    stepRunner(0);
  };

  // Calculate metrics
  const conciliados = result?.filter(item => item.estado === "✅").length || 0;
  const noRegistrados = result?.filter(item => item.estado === "⚠️").length || 0;
  const diferencias = result?.filter(item => item.estado === "❌").length || 0;
  const totalMovimientos = result?.length || 0;

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "✅": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "⚠️": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "❌": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "✅": return "Conciliado";
      case "⚠️": return "No registrado";
      case "❌": return "Diferencia";
      default: return estado;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-purple-600 to-purple-700">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Calculator className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Conciliación Bancaria, Contable y Fiscal
          </CardTitle>
          <p className="text-purple-100 text-lg">
            Análisis inteligente de discrepancias en tiempo real
          </p>
        </CardHeader>
      </Card>

      {/* Configuration Section */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Tipo de Conciliación:</label>
              <Select value={tipoConciliacion} onValueChange={setTipoConciliacion} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-purple-500">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bancaria">🏦 Bancaria</SelectItem>
                  <SelectItem value="contable">📊 Contable</SelectItem>
                  <SelectItem value="impuestos">🏛️ Impuestos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">Período:</label>
              <Select value={periodo} onValueChange={setPeriodo} disabled={loading}>
                <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-purple-500">
                  <SelectValue placeholder="Selecciona el período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enero-2025">Enero 2025</SelectItem>
                  <SelectItem value="febrero-2025">Febrero 2025</SelectItem>
                  <SelectItem value="marzo-2025">Marzo 2025</SelectItem>
                  <SelectItem value="abril-2025">Abril 2025</SelectItem>
                  <SelectItem value="mayo-2025">Mayo 2025</SelectItem>
                  <SelectItem value="junio-2025">Junio 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button
              onClick={handleEjecutar}
              disabled={loading}
              className="h-14 px-12 text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Search className="mr-3 h-6 w-6" />
                  Ejecutar
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
                  <h3 className="text-2xl font-bold text-white">Análisis de Conciliación en Progreso</h3>
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
                    <span>Inicio</span>
                    <span>Registros</span>
                    <span>Comparación</span>
                    <span>Reporte</span>
                  </div>
                </div>

                {/* Time Estimation */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-slate-300 text-sm">
                    Tiempo estimado: ~25 segundos
                  </div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
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
                        Procesando datos financieros en tiempo real...
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
                    Análisis de conciliación completado
                  </h3>
                  <p className="text-slate-600 text-lg">
                    Período: {periodo} | Tipo: {tipoConciliacion}
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
                  <span className="text-blue-100 text-sm font-medium">Total Movimientos</span>
                  <BarChart3 className="h-6 w-6 text-blue-200" />
                </div>
                <div className="text-3xl font-bold">{totalMovimientos}</div>
                <div className="text-blue-200 text-sm">Registros analizados</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm font-medium">Conciliados</span>
                  <CheckCircle2 className="h-6 w-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold">{conciliados}</div>
                <div className="text-green-200 text-sm">Sin discrepancias</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-yellow-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-100 text-sm font-medium">No Registrados</span>
                  <AlertTriangle className="h-6 w-6 text-yellow-200" />
                </div>
                <div className="text-3xl font-bold">{noRegistrados}</div>
                <div className="text-yellow-200 text-sm">Requieren atención</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-red-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-100 text-sm font-medium">Diferencias</span>
                  <XCircle className="h-6 w-6 text-red-200" />
                </div>
                <div className="text-3xl font-bold">{diferencias}</div>
                <div className="text-red-200 text-sm">Discrepancias críticas</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results Table */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Detalle de Movimientos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Fecha</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Descripción</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Banco</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Contable</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item, index) => (
                      <tr key={item.id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                        <td className="p-4 font-medium text-slate-800">{item.fecha}</td>
                        <td className="p-4 text-slate-700">{item.descripcion}</td>
                        <td className="p-4 font-semibold text-slate-900">
                          ${item.monto_bancario.toLocaleString()}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          ${item.monto_contable.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.estado)}
                            <span className="text-sm font-medium">
                              {getStatusText(item.estado)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Bot className="h-8 w-8" />
                Recomendación del Agente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-purple-100 text-lg mb-6 leading-relaxed">
                🤖 Detecté {noRegistrados + diferencias} movimientos no conciliados. 
                Sugiero revisar con tu área contable los movimientos no registrados y 
                verificar las diferencias encontradas para mantener la integridad financiera.
              </p>
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h4 className="font-semibold text-purple-100 mb-4 text-lg">Acciones Recomendadas:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Revisar movimientos no registrados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Validar diferencias de montos</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Contactar área contable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Solicitar auditoría interna</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Enviar Reporte por Correo
            </Button>
            <Button variant="outline" className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3">
              <FileText className="h-5 w-5 mr-2" />
              Solicitar Auditoría Interna
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
                <XCircle className="h-8 w-8 text-white" />
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