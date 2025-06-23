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
                    Análisis completado
                  </h3>
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
                    Recomendación del Agente:
                  </h3>
                  <p className="text-gray-800 text-lg">
                    {result.recomendacion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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