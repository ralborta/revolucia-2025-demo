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
  RefreshCw,
  Settings,
  Database,
  Zap,
  ChevronDown,
  X,
  TrendingUp,
  TrendingDown,
  Eye
} from "lucide-react";

interface SkuData {
    sku: string;
    producto: string;
    precio_actual: number;
    precio_competidor: number;
    recomendacion: string;
}

// Lista de SKUs disponibles para mostrar en dropdown
const availableSkus = [
  "SKU1025", "SKU2048", "SKU3071", "SKU4094", "SKU5117", "SKU6140", 
  "SKU7163", "SKU8186", "SKU9209", "SKU0232", "SKU1255", "SKU2278", 
  "SKU3301", "SKU4324", "SKU5347", "SKU6370", "SKU7393", "SKU8416", 
  "SKU9439", "SKU0462", "SKU1485", "SKU2508"
];

// Función para generar datos dinámicos basados en el SKU
const generateSkuData = (inputSku: string): SkuData => {
  const skuNumber = parseInt(inputSku.replace(/\D/g, '')) || 1000;
  const basePrice = 500 + (skuNumber % 2000);
  const competitorPrice = basePrice + (skuNumber % 200) - 100;
  const suggestedPrice = Math.round(basePrice * 0.85);
  
  const productNames = [
    "Componente Electrónico", "Equipo Industrial", "Herramienta Profesional", 
    "Material Especializado", "Dispositivo Avanzado", "Sistema Integrado",
    "Módulo Técnico", "Pieza Especializada", "Accesorio Premium"
  ];
  
  const productName = productNames[skuNumber % productNames.length];
  
  const recommendations = [
    `Basado en el análisis de mercado, recomendamos ajustar el precio a $${suggestedPrice} para optimizar la competitividad. Esta estrategia puede incrementar las ventas en un 15% manteniendo márgenes saludables.`,
    `El análisis sugiere reducir el precio a $${suggestedPrice} para mejorar la posición competitiva. Se proyecta un aumento del 12% en volumen de ventas con esta optimización.`,
    `Recomendamos implementar un precio de $${suggestedPrice} basado en tendencias del mercado y análisis de competidores. Esta estrategia balanceará competitividad y rentabilidad.`
  ];
  
  return {
    sku: inputSku.toUpperCase(),
    producto: `${productName} ${inputSku.slice(-1).toUpperCase()}`,
    precio_actual: basePrice,
    precio_competidor: competitorPrice,
    recomendacion: recommendations[skuNumber % recommendations.length]
  };
};

const analysisSteps = [
  { 
    text: "Analizando datos del producto...", 
    icon: Search, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 8,
    duration: 3000
  },
  { 
    text: "Consultando precios de competidores...", 
    icon: BarChart3, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 18,
    duration: 4000
  },
  { 
    text: "Analizando presupuesto y márgenes...", 
    icon: DollarSign, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 28,
    duration: 3500
  },
  { 
    text: "Evaluando objetivos de venta...", 
    icon: Target, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 38,
    duration: 3500
  },
  { 
    text: "Calculando ritmo de ventas actual...", 
    icon: BarChart3, 
    bgColor: "bg-orange-600", 
    iconColor: "text-white",
    progress: 48,
    duration: 4000
  },
  { 
    text: "Verificando niveles de stock...", 
    icon: Package, 
    bgColor: "bg-indigo-600", 
    iconColor: "text-white",
    progress: 58,
    duration: 3500
  },
  { 
    text: "Procesando información recopilada...", 
    icon: Bot, 
    bgColor: "bg-slate-600", 
    iconColor: "text-white",
    progress: 65,
    duration: 5000,
    isPause: true
  },
  { 
    text: "🔗 Conectando con Agente de Costos...", 
    icon: RefreshCw, 
    bgColor: "bg-cyan-600", 
    iconColor: "text-white",
    progress: 72,
    duration: 4000
  },
  { 
    text: "Consultando estructura de costos...", 
    icon: DollarSign, 
    bgColor: "bg-cyan-600", 
    iconColor: "text-white",
    progress: 82,
    duration: 4500
  },
  { 
    text: "Verificando Markup% y rentabilidad...", 
    icon: Target, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 92,
    duration: 4000
  },
  { 
    text: "Generando recomendación inteligente...", 
    icon: Bot, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 3000
  },
];

const implementationSteps = [
  { 
    text: "🔗 Conectando con ERP principal...", 
    icon: Database, 
    bgColor: "bg-blue-600", 
    iconColor: "text-white",
    progress: 15,
    duration: 2500
  },
  { 
    text: "Validando permisos de modificación...", 
    icon: Settings, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 30,
    duration: 2000
  },
  { 
    text: "Actualizando precio en base de datos...", 
    icon: Database, 
    bgColor: "bg-purple-600", 
    iconColor: "text-white",
    progress: 50,
    duration: 3000
  },
  { 
    text: "Sincronizando con sistema de ventas...", 
    icon: RefreshCw, 
    bgColor: "bg-orange-600", 
    iconColor: "text-white",
    progress: 70,
    duration: 2500
  },
  { 
    text: "Notificando al equipo comercial...", 
    icon: Bot, 
    bgColor: "bg-cyan-600", 
    iconColor: "text-white",
    progress: 85,
    duration: 2000
  },
  { 
    text: "Implementación completada ✓", 
    icon: CheckCircle2, 
    bgColor: "bg-green-600", 
    iconColor: "text-white",
    progress: 100,
    duration: 1500
  },
];

export function PricingDemo() {
  const [sku, setSku] = useState("SKU1025");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCompetitorModal, setShowCompetitorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [implementing, setImplementing] = useState(false);
  const [implemented, setImplemented] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentImplStep, setCurrentImplStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [implProgress, setImplProgress] = useState(0);
  const [result, setResult] = useState<SkuData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsultar = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setImplemented(false);

    // Simulate analysis steps with realistic timing (45 seconds total)
    const stepRunner = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        // Generar datos para cualquier SKU
        const generatedData = generateSkuData(sku);
        setResult(generatedData);
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
          
          // Add pause for strategic analysis step
          const nextStepDelay = currentStepData.isPause ? 2000 : 800;
          setTimeout(() => stepRunner(stepIndex + 1), nextStepDelay);
        }
        setProgress(Math.min(currentProgress, targetProgress));
      }, 100);
    };

    stepRunner(0);
  };

  const handleImplementar = async () => {
    setImplementing(true);
    setCurrentImplStep(0);
    setImplProgress(0);

    // Simulate implementation steps (15 seconds total)
    const implStepRunner = (stepIndex: number) => {
      if (stepIndex >= implementationSteps.length) {
        setImplementing(false);
        setImplemented(true);
        return;
      }
      
      const currentStepData = implementationSteps[stepIndex];
      setCurrentImplStep(stepIndex);
      
      // Animate progress gradually
      const targetProgress = currentStepData.progress;
      const startProgress = stepIndex > 0 ? implementationSteps[stepIndex - 1].progress : 0;
      const duration = currentStepData.duration;
      const increment = (targetProgress - startProgress) / (duration / 100);
      let currentProgress = startProgress;
      
      const progressTimer = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= targetProgress) {
          currentProgress = targetProgress;
          clearInterval(progressTimer);
          
          setTimeout(() => implStepRunner(stepIndex + 1), 500);
        }
        setImplProgress(Math.min(currentProgress, targetProgress));
      }, 100);
    };

    implStepRunner(0);
  };

  const handleSkuSelect = (selectedSku: string) => {
    setSku(selectedSku);
    setShowDropdown(false);
  };

  const competitorPrices = result ? [
    { name: "TechnoMax", price: result.precio_competidor + 15 },
    { name: "IndustrialPro", price: result.precio_competidor - 15 },
    { name: "PremiumTools", price: result.precio_competidor + 30 }
  ] : [
    { name: "TechnoMax", price: 980 },
    { name: "IndustrialPro", price: 965 },
    { name: "PremiumTools", price: 995 }
  ];

  const averageCompetitorPrice = Math.round(competitorPrices.reduce((sum, comp) => sum + comp.price, 0) / competitorPrices.length);
  const suggestedPrice = result ? Math.round(result.precio_actual * 0.85) : 970;

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
            Análisis inteligente de precios con IA
          </p>
        </CardHeader>
      </Card>

      {/* SKU Input Section */}
      {!implementing && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <label className="text-lg font-semibold text-slate-800">SKU:</label>
              <div className="flex gap-4 items-center">
                <div className="relative max-w-sm">
                  <Input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    disabled={loading}
                    className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 pr-12"
                    placeholder="Ingrese SKU (ej: SKU1025)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                  
                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {availableSkus.map((skuOption) => (
                        <button
                          key={skuOption}
                          onClick={() => handleSkuSelect(skuOption)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 font-medium"
                        >
                          {skuOption}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleConsultar} 
                  disabled={loading}
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                  size="lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Ejecutar Análisis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Implementation Loading Screen */}
      {implementing && (
        <div className="space-y-6">
          {/* Implementation Progress Bar */}
          <Card className="border-none shadow-lg bg-gradient-to-r from-green-800 to-green-900">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Implementando Recomendación</h3>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">{Math.round(implProgress)}%</div>
                      <div className="text-green-300 text-sm">Completado</div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="space-y-3">
                  <Progress 
                    value={implProgress} 
                    className="h-4 bg-green-700 border border-green-600" 
                  />
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Conexión ERP</span>
                    <span>Validación</span>
                    <span>Actualización</span>
                    <span>Finalización</span>
                  </div>
                </div>

                {/* Time Estimation */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-green-300 text-sm">
                    Tiempo estimado: ~15 segundos
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="text-green-300 text-sm">
                    Paso {currentImplStep + 1} de {implementationSteps.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Current Implementation Step */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className={`${implementationSteps[currentImplStep]?.bgColor} p-8`}>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                      {implementationSteps[currentImplStep] && 
                        createElement(implementationSteps[currentImplStep].icon, {
                          className: `h-12 w-12 ${implementationSteps[currentImplStep].iconColor}`
                        })
                      }
                    </div>
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {implementationSteps[currentImplStep]?.text}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="text-white/80 text-lg">
                        {currentImplStep < 2 ? "Estableciendo conexión segura..." : 
                         currentImplStep < 4 ? "Aplicando cambios en tiempo real..." : 
                         "Finalizando implementación..."}
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
                      {(currentImplStep + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="text-white/60 text-sm">de {implementationSteps.length.toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Implementation Success */}
      {implemented && result && (
        <Card className="border-none shadow-lg bg-green-50 border-green-200">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-6 rounded-full bg-green-600">
                  <CheckCircle2 className="h-16 w-16 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-green-800">
                ¡Implementación Exitosa!
              </h3>
              <p className="text-green-700 text-xl">
                El nuevo precio de ${suggestedPrice} ha sido aplicado correctamente
              </p>
              <div className="bg-white p-6 rounded-lg border border-green-200 max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-800">${result.precio_actual.toLocaleString()}</div>
                    <div className="text-slate-600">Precio Anterior</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">${suggestedPrice.toLocaleString()}</div>
                    <div className="text-slate-600">Nuevo Precio</div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Realizar Nuevo Análisis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
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
                    <span>Inicio</span>
                    <span>Análisis</span>
                    <span>Costos</span>
                    <span>Finalización</span>
                  </div>
                </div>

                {/* Time Estimation */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-slate-300 text-sm">
                    Tiempo estimado: ~45 segundos
                  </div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
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
                        {analysisSteps[currentStep]?.isPause 
                          ? "Consolidando información antes de continuar..." 
                          : "Procesando datos en tiempo real..."
                        }
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
              
              {/* Step details */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">
                      {currentStep < 6 ? "Recopilando información" : 
                       currentStep < 10 ? "Consultando agente de costos" : 
                       "Generando recomendación"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">
                      Conexión: {currentStep >= 7 ? "Agente de Costos" : "Base de datos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-600">
                      Estado: {analysisSteps[currentStep]?.isPause ? "Procesando" : "Activo"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Timeline */}
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-100">
              <CardTitle className="text-lg text-slate-800">Línea de Tiempo del Análisis</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {analysisSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      index <= currentStep 
                        ? `${step.bgColor} text-white shadow-md transform scale-105` 
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {createElement(step.icon, { className: "h-3 w-3" })}
                    <span className="hidden sm:inline">
                      {step.text.replace(/🔗\s/, '').substring(0, 20)}...
                    </span>
                    {index <= currentStep && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {result && !implementing && !implemented && (
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

            <Card 
              className="border-none shadow-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setShowCompetitorModal(true)}
            >
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm font-medium">Promedio Competencia</span>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-blue-200" />
                    <Eye className="h-4 w-4 text-blue-200" />
                  </div>
                </div>
                <div className="text-3xl font-bold">${averageCompetitorPrice.toLocaleString()}</div>
                <div className="text-blue-200 text-sm flex items-center justify-center gap-1">
                  Top 3 competidores
                  <ChevronDown className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-100 text-sm font-medium">Precio Sugerido</span>
                  <Target className="h-6 w-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold">${suggestedPrice.toLocaleString()}</div>
                <div className="text-green-200 text-sm">Optimización IA</div>
              </CardContent>
            </Card>
          </div>

          {/* Modal de Competidores */}
          {showCompetitorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header del Modal */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <BarChart3 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Análisis de Competencia</h3>
                        <p className="text-blue-100">Precios detallados del mercado para {result?.sku}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCompetitorModal(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Contenido del Modal */}
                <div className="p-6 space-y-6">
                  {/* Producto Analizado */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">{result?.producto}</h4>
                        <p className="text-slate-600 text-sm">SKU: {result?.sku}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800">${result?.precio_actual.toLocaleString()}</div>
                        <div className="text-slate-600 text-sm">Precio Actual</div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Competidores */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 border-b pb-2">
                      Precios de Competidores
                    </h4>
                    
                    {competitorPrices.map((competitor, index) => {
                      const isLowest = competitor.price === Math.min(...competitorPrices.map(c => c.price));
                      const isHighest = competitor.price === Math.max(...competitorPrices.map(c => c.price));
                      const currentPrice = result?.precio_actual || 0;
                      const difference = competitor.price - currentPrice;
                      const percentDiff = ((difference / currentPrice) * 100);
                      
                      return (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                            isLowest ? 'bg-green-50 border-green-200' :
                            isHighest ? 'bg-red-50 border-red-200' :
                            'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full ${
                                isLowest ? 'bg-green-500' :
                                isHighest ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}></div>
                              <div>
                                <div className="font-semibold text-slate-800">{competitor.name}</div>
                                <div className="text-sm text-slate-600">
                                  {isLowest && '🏆 Precio más bajo'}
                                  {isHighest && '💰 Precio más alto'}
                                  {!isLowest && !isHighest && '📊 Precio medio'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-slate-800">
                                ${competitor.price.toLocaleString()}
                              </div>
                              <div className={`text-sm flex items-center gap-1 ${
                                difference > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {difference > 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {difference > 0 ? '+' : ''}${Math.abs(difference).toLocaleString()}
                                ({percentDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Análisis Resumido */}
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Análisis Competitivo
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Precio promedio mercado:</span>
                          <span className="font-bold text-blue-900">${averageCompetitorPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Rango de precios:</span>
                          <span className="font-bold text-blue-900">
                            ${Math.min(...competitorPrices.map(c => c.price)).toLocaleString()} - 
                            ${Math.max(...competitorPrices.map(c => c.price)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Posición actual:</span>
                          <span className="font-bold text-blue-900">
                            {result && result.precio_actual < averageCompetitorPrice ? 'Por debajo del promedio' : 'Por encima del promedio'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Competidor más bajo:</span>
                          <span className="font-bold text-green-700">
                            {competitorPrices.find(c => c.price === Math.min(...competitorPrices.map(p => p.price)))?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Diferencia vs promedio:</span>
                          <span className={`font-bold ${
                            result && result.precio_actual < averageCompetitorPrice ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result && (((result.precio_actual - averageCompetitorPrice) / averageCompetitorPrice) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Recomendación:</span>
                          <span className="font-bold text-purple-600">Ajustar a ${suggestedPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => setShowCompetitorModal(false)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Entendido
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowCompetitorModal(false);
                        // Trigger implementation
                        handleImplementar();
                      }}
                      className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Implementar Precio
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                      <span className="font-bold text-blue-600">${Math.round(result.precio_actual * 1.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Mejor día:</span>
                      <span className="font-bold text-green-600">67 unidades</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800 mb-4 text-lg">Rendimiento vs Competencia:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Posición en mercado:</span>
                      <span className="font-bold text-slate-800">#2 de 8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Cuota de mercado:</span>
                      <span className="font-bold text-slate-800">18.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">Oportunidad de mejora:</span>
                      <span className="font-bold text-orange-600">+4.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={handleImplementar}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3"
            >
              <Zap className="h-5 w-5 mr-2" />
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