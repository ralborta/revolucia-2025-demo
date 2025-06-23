"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, BrainCircuit, Bot, TrendingUp, TrendingDown, DollarSign, Target, BarChart3 } from "lucide-react";
import data from "@/../mock/sku1025.json";

interface SkuData {
    sku: string;
    producto: string;
    precio_actual: number;
    precio_competidor: number;
    recomendacion: string;
}

const steps = [
  { text: "Consultando datos del producto...", icon: Search, color: "text-blue-500" },
  { text: "Analizando precios de competidores...", icon: BrainCircuit, color: "text-purple-500" },
  { text: "Evaluando tendencias de mercado...", icon: TrendingUp, color: "text-green-500" },
  { text: "Agente determinando recomendación...", icon: Bot, color: "text-orange-500" },
];

export function PricingDemo() {
  const [sku, setSku] = useState("SKU1025");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<SkuData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsultar = async () => {
    if (!sku.trim()) {
      setError("Por favor ingresa un SKU válido");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    // Simulate analysis steps
    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        if (sku.toUpperCase() === "SKU1025") {
          setResult(data);
        } else {
          setError("SKU no encontrado. Por favor, intente con 'SKU1025'.");
        }
        setLoading(false);
        return;
      }
      setCurrentStep(stepIndex);
      setTimeout(() => stepRunner(stepIndex + 1), 1500);
    };

    stepRunner(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleConsultar();
    }
  };

  const getVariationColor = (actual: number, competidor: number) => {
    const diff = actual - competidor;
    if (diff > 0) return "text-red-500";
    if (diff < 0) return "text-green-500";
    return "text-gray-500";
  };

  const getVariationIcon = (actual: number, competidor: number) => {
    const diff = actual - competidor;
    if (diff > 0) return TrendingDown;
    if (diff < 0) return TrendingUp;
    return Target;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧠 Agente IA de Pricing
        </h1>
        <p className="text-muted-foreground text-lg">
          Simula el análisis inteligente de precios con datos de mercado en tiempo real
        </p>
      </div>

      {/* Input Section */}
      <Card className="border-2 border-dashed border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consulta de Producto por SKU
          </CardTitle>
          <CardDescription>
            Ingresa el código SKU del producto para obtener recomendaciones de pricing basadas en IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Ej: SKU1025"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="text-lg font-mono"
            />
            <Button onClick={handleConsultar} disabled={loading} size="lg">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Consultar
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Prueba con &quot;SKU1025&quot; para ver el demo completo
          </div>
        </CardContent>
      </Card>

      {/* Loading Animation */}
      {loading && (
        <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-8">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isDone = index < currentStep;
                  return (
                    <div key={index} className={`flex flex-col items-center transition-all duration-500 ${isActive || isDone ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
                      <div className={`p-3 rounded-full transition-all duration-300 ${
                        isDone ? 'bg-green-500 text-white shadow-lg' : 
                        isActive ? 'bg-primary text-white shadow-lg animate-pulse' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        <StepIcon className="h-6 w-6" />
                      </div>
                      {isActive && (
                        <div className="mt-3 text-center">
                          <p className="text-sm font-medium">{step.text}</p>
                          <div className="mt-2 w-16 h-1 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="border-2">
          <AlertTitle>❌ SKU no encontrado</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {/* Main Result Card */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Bot className="h-6 w-6" />
                Análisis Completado - {result.producto}
              </CardTitle>
              <CardDescription>
                Recomendación generada por el agente IA de pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Info */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">SKU</Badge>
                  </div>
                  <p className="text-2xl font-bold font-mono">{result.sku}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Precio Actual</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">${result.precio_actual}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Precio Competidor</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">${result.precio_competidor}</p>
                </div>
              </div>

              {/* Price Comparison */}
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Comparación de Precios:</span>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const VariationIcon = getVariationIcon(result.precio_actual, result.precio_competidor);
                      return (
                        <VariationIcon className={`h-4 w-4 ${getVariationColor(result.precio_actual, result.precio_competidor)}`} />
                      );
                    })()}
                    <span className={`text-sm font-bold ${getVariationColor(result.precio_actual, result.precio_competidor)}`}>
                      {result.precio_actual > result.precio_competidor ? '+' : ''}
                      ${result.precio_actual - result.precio_competidor}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <Alert className="border-2 border-primary/30 bg-primary/5">
                <Bot className="h-5 w-5 text-primary" />
                <AlertTitle className="text-primary font-bold">🤖 Recomendación del Agente IA</AlertTitle>
                <AlertDescription className="text-lg font-semibold mt-2">
                  {result.recomendacion}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Additional Info Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Análisis de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tendencia de precios:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Estable</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Competencia activa:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">3 competidores</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Stock disponible:</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Alto</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Impacto Esperado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Margen proyectado:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">+12%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ventas esperadas:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">+25%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Riesgo:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Bajo</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Demo Notice */}
      <Card className="border-2 border-dashed border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🧪</div>
            <div className="space-y-1">
              <p className="font-semibold text-orange-800">Demo Interactivo</p>
              <p className="text-sm text-orange-700">
                Este es un demo con datos simulados. En producción, el agente trabaja con información real desde APIs y bases de datos internas, 
                analizando millones de registros en tiempo real para generar recomendaciones precisas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 