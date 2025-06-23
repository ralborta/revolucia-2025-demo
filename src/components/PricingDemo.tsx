"use client";

import { useState, createElement } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Bot, 
  CheckCircle2, 
  DollarSign, 
  BarChart3, 
  Target,
  Package,
  Download,
  RefreshCw
} from "lucide-react";
import data from "@/../mock/sku1025.json";

interface SkuData {
    sku: string;
    producto: string;
    precio_actual: number;
    precio_competidor: number;
    recomendacion: string;
}

const analysisSteps = [
  { 
    text: "Consultando datos del producto...", 
    icon: Search, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 25 
  },
  { 
    text: "Analizando precios competidores...", 
    icon: BarChart3, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 65 
  },
  { 
    text: "Generando recomendación inteligente...", 
    icon: Target, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 100 
  },
];

export function PricingDemo() {
  const [sku, setSku] = useState("SKU1025");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SkuData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsultar = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);
    setProgress(0);

    // Simulate analysis steps with slower timing
    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        if (sku.toUpperCase() === "SKU1025") {
          setResult(data);
        } else {
          setError("SKU no encontrado. Por favor, intente con 'SKU1025'.");
        }
        setLoading(false);
        return;
      }
      
      setCurrentStep(stepIndex);
      
      // Animate progress gradually
      const targetProgress = analysisSteps[stepIndex].progress;
      const startProgress = stepIndex > 0 ? analysisSteps[stepIndex - 1].progress : 0;
      const duration = 2500; // 2.5 seconds per step
      const increment = (targetProgress - startProgress) / (duration / 50);
      let currentProgress = startProgress;
      
      const progressTimer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= targetProgress) {
          currentProgress = targetProgress;
          clearInterval(progressTimer);
          setTimeout(() => stepRunner(stepIndex + 1), 500);
        }
        setProgress(currentProgress);
      }, 50);
    };

    stepRunner(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
        <CardHeader className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Consulta SKU y/o Producto
          </CardTitle>
          <p className="text-blue-100 text-lg">
            Análisis inteligente de precios en tiempo real
          </p>
        </CardHeader>
      </Card>

      {/* SKU Input Section */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <label className="text-lg font-semibold text-slate-800">SKU:</label>
            <div className="flex gap-4 items-center">
              <Input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                disabled={loading}
                className="max-w-sm h-12 text-lg border-2 border-slate-200 focus:border-blue-500"
                placeholder="SKU1025"
              />
              <Button 
                onClick={handleConsultar} 
                disabled={loading}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                size="lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Consultar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {loading && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">Progreso del Análisis</h3>
                  <span className="text-sm font-medium text-slate-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>
          
          {/* Current Step */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${analysisSteps[currentStep]?.bgColor}`}>
                  {analysisSteps[currentStep] && 
                    createElement(analysisSteps[currentStep].icon, {
                      className: `h-8 w-8 ${analysisSteps[currentStep].iconColor}`
                    })
                  }
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    {analysisSteps[currentStep]?.text}
                  </h3>
                  <p className="text-slate-600">Procesando información...</p>
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
                    Análisis completado para: {result.producto}
                  </h3>
                  <p className="text-slate-600 text-lg">SKU: {result.sku}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details - Resumen de Precios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-slate-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200 text-sm font-medium">Precio Actual</span>
                  <Package className="h-6 w-6 text-slate-300" />
                </div>
                <div className="text-3xl font-bold">${result.precio_actual.toLocaleString()}</div>
                <div className="text-slate-300 text-sm">Precio vigente</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">Precio Competidor</span>
                  <BarChart3 className="h-6 w-6 text-blue-200" />
                </div>
                <div className="text-3xl font-bold">${result.precio_competidor.toLocaleString()}</div>
                <div className="text-blue-200 text-sm">Mercado actual</div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm font-medium">Precio Sugerido</span>
                  <Target className="h-6 w-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold">$970</div>
                <div className="text-green-200 text-sm">Optimización IA</div>
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Análisis de Mercado</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Demanda actual:</span>
                    <span className="font-bold text-green-600 text-lg">Alta</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Tendencia:</span>
                    <span className="font-bold text-blue-600 text-lg">↗ Creciente</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Stock disponible:</span>
                    <span className="font-bold text-slate-800 text-lg">1,250 unidades</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Margen actual:</span>
                    <span className="font-bold text-slate-800 text-lg">28.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Margen sugerido:</span>
                    <span className="font-bold text-green-600 text-lg">31.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">Ventas estimadas:</span>
                    <span className="font-bold text-blue-600 text-lg">+15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Bot className="h-8 w-8" />
                Recomendación del Agente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-purple-100 text-lg mb-6 leading-relaxed">
                {result.recomendacion}
              </p>
              <div className="bg-white/10 rounded-lg p-6 border border-white/20">
                <h4 className="font-semibold text-purple-100 mb-4 text-lg">Impacto Esperado:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Incremento en ventas:</span>
                      <span className="font-bold text-green-300">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mejora en competitividad:</span>
                      <span className="font-bold text-blue-300">Muy Alta</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tiempo de implementación:</span>
                      <span className="font-bold">24 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI proyectado:</span>
                      <span className="font-bold text-green-300">+12.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Data */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Datos Históricos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 mb-4 text-lg">Últimos 30 días:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Ventas promedio:</span>
                      <span className="font-bold text-blue-600">45 unidades/día</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Precio promedio:</span>
                      <span className="font-bold text-blue-600">$1,050</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Mejor día:</span>
                      <span className="font-bold text-green-600">67 unidades</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 mb-4 text-lg">Comparación Competencia:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Competidor A:</span>
                      <span className="font-bold text-slate-800">$980</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Competidor B:</span>
                      <span className="font-bold text-slate-800">$965</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Promedio mercado:</span>
                      <span className="font-bold text-orange-600">$972</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Implementar Recomendación
            </Button>
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3">
              <Download className="h-5 w-5 mr-2" />
              Exportar Análisis
            </Button>
            <Button variant="outline" className="border-2 border-slate-600 text-slate-600 hover:bg-slate-50 font-semibold px-8 py-3">
              <RefreshCw className="h-5 w-5 mr-2" />
              Consultar Otro SKU
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
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-red-900">Error en la consulta</h3>
                <p className="text-red-700 text-lg">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 