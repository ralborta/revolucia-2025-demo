"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Search, BrainCircuit, Bot } from "lucide-react";
import data from "@/../mock/sku1025.json";

interface SkuData {
    sku: string;
    producto: string;
    precio_actual: number;
    precio_competidor: number;
    recomendacion: string;
}

const steps = [
  { text: "Consultando datos...", icon: Search },
  { text: "Analizando precios competidores...", icon: BrainCircuit },
  { text: "Agente determinando recomendación...", icon: Bot },
];

export function PricingDemo() {
  const [sku, setSku] = useState("SKU1025");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<SkuData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsultar = async () => {
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
      setTimeout(() => stepRunner(stepIndex + 1), 1200);
    };

    stepRunner(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Consulta de Pricing por SKU</CardTitle>
        <CardDescription>
          Ingresa un SKU para simular un análisis de precios por IA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ej: SKU1025"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleConsultar} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Consultar
          </Button>
        </div>

        {loading && (
          <div className="text-center p-4 rounded-md bg-muted">
            <div className="flex items-center justify-center space-x-2">
                {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isDone = index < currentStep;
                    return (
                        <div key={index} className={`flex flex-col items-center transition-opacity duration-300 ${isActive || isDone ? 'opacity-100' : 'opacity-30'}`}>
                           <div className={`p-2 rounded-full ${isDone ? 'bg-green-500 text-white' : 'bg-primary/20'}`}>
                             <StepIcon className={`h-6 w-6 ${isActive ? 'animate-pulse' : ''}`} />
                           </div>
                           {isActive && <p className="text-sm mt-2">{step.text}</p>}
                        </div>
                    );
                })}
            </div>
          </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>Resultado del Análisis para: {result.producto}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div><span className="font-semibold">SKU:</span> {result.sku}</div>
                    <div><span className="font-semibold">Precio Actual:</span> ${result.precio_actual}</div>
                    <div><span className="font-semibold">Precio Competidor:</span> ${result.precio_competidor}</div>
                    <Alert className="md:col-span-2 bg-primary/10 border-primary/30">
                        <Bot className="h-4 w-4" />
                        <AlertTitle>Recomendación del Agente</AlertTitle>
                        <AlertDescription className="font-semibold text-lg">{result.recomendacion}</AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )}

        <p className="text-xs text-center text-muted-foreground pt-4">
            🧪 Este es un demo con datos simulados. En producción, el agente trabaja con información real desde APIs y bases internas.
        </p>
      </CardContent>
    </Card>
  );
} 