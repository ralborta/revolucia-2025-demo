"use client";

import { useState, createElement } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Search, Bot, TrendingUp, CheckCircle2 } from "lucide-react";
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
    text: "Consultando datos...", 
    icon: Search, 
    bgColor: "bg-blue-100", 
    iconColor: "text-blue-600",
    progress: 25 
  },
  { 
    text: "Analizando precios competidores...", 
    icon: TrendingUp, 
    bgColor: "bg-cyan-100", 
    iconColor: "text-cyan-600",
    progress: 65 
  },
  { 
    text: "Agente determinando recomendación...", 
    icon: Bot, 
    bgColor: "bg-blue-100", 
    iconColor: "text-blue-600",
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Pricing</h1>
        
        {/* SKU Input Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">SKU:</label>
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              disabled={loading}
              className="max-w-xs h-12 text-lg"
              placeholder="SKU1025"
            />
            <Button 
              onClick={handleConsultar} 
              disabled={loading}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Consultar
            </Button>
          </div>
        </div>
      </div>

      {/* Analysis Progress */}
      {loading && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full">
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Current Step */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${analysisSteps[currentStep]?.bgColor}`}>
                  {analysisSteps[currentStep] && 
                    createElement(analysisSteps[currentStep].icon, {
                      className: `h-6 w-6 ${analysisSteps[currentStep].iconColor}`
                    })
                  }
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {analysisSteps[currentStep]?.text}
                  </h3>
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
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Análisis completado para: {result.producto}
                  </h3>
                  <p className="text-sm text-gray-600">SKU: {result.sku}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">${result.precio_actual}</div>
                <div className="text-sm text-gray-600">Precio Actual</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-900">${result.precio_competidor}</div>
                <div className="text-sm text-gray-600">Precio Competidor</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">$970</div>
                <div className="text-sm text-gray-600">Precio Sugerido</div>
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Mercado</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Demanda actual:</span>
                    <span className="font-medium text-green-600">Alta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tendencia:</span>
                    <span className="font-medium text-blue-600">↗ Creciente</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock disponible:</span>
                    <span className="font-medium">1,250 unidades</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margen actual:</span>
                    <span className="font-medium">28.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margen sugerido:</span>
                    <span className="font-medium text-green-600">31.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ventas estimadas:</span>
                    <span className="font-medium text-blue-600">+15%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-0 shadow-sm bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recomendación del Agente IA:
                  </h3>
                  <p className="text-gray-800 text-lg mb-4">
                    {result.recomendacion}
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-2">Impacto Esperado:</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Incremento en ventas: <strong className="text-green-600">+15%</strong></li>
                      <li>• Mejora en competitividad: <strong className="text-blue-600">Muy Alta</strong></li>
                      <li>• Tiempo estimado de implementación: <strong>24 horas</strong></li>
                      <li>• ROI proyectado: <strong className="text-green-600">+12.8%</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Data */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Datos Históricos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Últimos 30 días:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Ventas promedio:</span>
                      <span className="font-medium">45 unidades/día</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio promedio:</span>
                      <span className="font-medium">$1,050</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mejor día:</span>
                      <span className="font-medium text-green-600">67 unidades</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Comparación Competencia:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Competidor A:</span>
                      <span className="font-medium">$980</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Competidor B:</span>
                      <span className="font-medium">$965</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promedio mercado:</span>
                      <span className="font-medium">$972</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Implementar Recomendación
            </Button>
            <Button variant="outline">
              Exportar Análisis
            </Button>
            <Button variant="outline">
              Consultar Otro SKU
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <Search className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 