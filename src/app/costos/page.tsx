"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Costos } from "@/components/CostosDemo";
import costosData from "@/../data/costos.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
  Bot,
  Package,
  Factory,
  FileDown
} from "lucide-react";

// This type should ideally be shared or imported from a central types file
interface CostoItem {
    id: string;
    insumo: string;
    costo_actual: number;
    variacion_esperada: number;
    impacto_operativo: string;
    mensaje_ia: string;
}

export default function CostosPage() {
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Calcular métricas resumidas
  const totalInsumos = costosData.length;
  const insumosAlza = costosData.filter(item => item.variacion_esperada > 0).length;
  const insumosBaja = costosData.filter(item => item.variacion_esperada < 0).length;
  const insumosEstables = costosData.filter(item => item.variacion_esperada === 0).length;
  const costoTotal = costosData.reduce((acc, item) => acc + item.costo_actual, 0);
  const variacionPromedio = costosData.reduce((acc, item) => acc + item.variacion_esperada, 0) / totalInsumos;

  const getVariationIcon = (variacion: number) => {
    return variacion > 0 ? 
      <TrendingUp className="h-5 w-5 text-red-500" /> : 
      variacion < 0 ? <TrendingDown className="h-5 w-5 text-green-500" /> :
      <div className="h-5 w-5"></div>;
  };

  const getVariationColor = (variacion: number) => {
    return variacion > 0 ? 'text-red-600' : variacion < 0 ? 'text-green-600' : 'text-slate-600';
  };

  return (
    <>
      <Header title="Agente de Costos" />
      <main className="flex-1 flex flex-col gap-6 p-6 bg-slate-50">
        {/* Analysis Interactive Section */}
        {showAnalysis ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-800">
                Análisis Inteligente de Costos
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowAnalysis(false)}
                className="flex items-center gap-2 bg-white hover:bg-slate-100"
              >
                ← Volver al Dashboard
              </Button>
            </div>
            <Costos />
          </div>
        ) : (
          <>
            {/* Analysis Activation Button */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-orange-600 to-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Análisis Inteligente de Costos</h3>
                      <p className="text-orange-100">
                        Ejecuta el agente IA para análisis de costos con simulación de WhatsApp y Email
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button 
                      onClick={() => setShowAnalysis(true)} 
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-12 py-4 text-lg"
                    >
                      <BarChart3 className="h-6 w-6 mr-3" />
                      Ejecutar Análisis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-lg bg-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Insumos</p>
                      <p className="text-3xl font-bold">{totalInsumos}</p>
                      <p className="text-blue-100 text-sm">Productos analizados</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">En Alza</p>
                      <p className="text-3xl font-bold">{insumosAlza}</p>
                      <p className="text-red-100 text-sm">Costos aumentando</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">En Baja</p>
                      <p className="text-3xl font-bold">{insumosBaja}</p>
                      <p className="text-green-100 text-sm">Costos reduciendo</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Costo Total</p>
                      <p className="text-3xl font-bold">${Math.round(costoTotal).toLocaleString()}</p>
                      <p className="text-orange-100 text-sm">Valor actual</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de Variaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-orange-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Variación Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${getVariationColor(variacionPromedio)}`}>
                      {variacionPromedio > 0 ? '+' : ''}{variacionPromedio.toFixed(1)}%
                    </div>
                    <p className="text-slate-600">Tendencia general de costos</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-slate-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Factory className="h-6 w-6" />
                    Estado General
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Estables:</span>
                      <span className="font-semibold">{insumosEstables}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">Incremento:</span>
                      <span className="font-semibold text-red-600">{insumosAlza}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">Reducción:</span>
                      <span className="font-semibold text-green-600">{insumosBaja}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Insumos Detallada */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-800 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Análisis de Costos por Insumo</CardTitle>
                  <Button className="bg-white text-slate-800 hover:bg-slate-100">
                    <FileDown className="h-4 w-4 mr-2" />
                    Exportar Análisis
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Insumo / Servicio</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Costo Actual</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Variación Esperada</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Impacto Operativo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costosData.map((item: CostoItem, index) => (
                        <tr key={item.id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                          <td className="p-4 font-mono text-sm font-semibold text-orange-600">{item.id}</td>
                          <td className="p-4 font-medium text-slate-800">{item.insumo}</td>
                          <td className="p-4 font-semibold text-slate-900">
                            ${item.costo_actual.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getVariationIcon(item.variacion_esperada)}
                              <span className={`font-semibold ${getVariationColor(item.variacion_esperada)}`}>
                                {item.variacion_esperada > 0 ? '+' : ''}{item.variacion_esperada.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-700">{item.impacto_operativo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Alertas y Recomendaciones del Agente IA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertas Críticas */}
              <Card className="border-none shadow-lg border-red-200 bg-red-50">
                <CardHeader className="bg-red-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Alertas de Costos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                      <TrendingUp className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Costos en aumento</p>
                        <p className="text-sm text-red-700">{insumosAlza} insumos con incremento esperado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                      <DollarSign className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Impacto financiero</p>
                        <p className="text-sm text-red-700">Variación promedio: {variacionPromedio > 0 ? '+' : ''}{variacionPromedio.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights del Agente IA */}
              <Card className="border-none shadow-lg bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    Insights del Agente IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-orange-100 mb-2">Recomendación Principal</h4>
                      <p className="text-white text-sm">
                        {costosData[0]?.mensaje_ia || "Se recomienda monitorear de cerca los costos con tendencia al alza y considerar estrategias de mitigación."}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-100 mb-2">Próximos Pasos</h4>
                      <ul className="text-white text-sm space-y-1">
                        <li>• Revisar contratos con proveedores</li>
                        <li>• Evaluar proveedores alternativos</li>
                        <li>• Negociar descuentos por volumen</li>
                        <li>• Considerar compras anticipadas</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </>
  );
} 