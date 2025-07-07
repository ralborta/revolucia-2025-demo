"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { PricingDemo } from "@/components/PricingDemo";
import pricingData from "@/../data/pricing.json";
import { Button } from "@/components/ui/button";
import { 
  TrendingDown, 
  TrendingUp, 
  Bot, 
  Search, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Target,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  const [showDemo, setShowDemo] = useState(false);

  // Calcular métricas resumidas
  const totalProducts = pricingData.length;
  const averageVariation = pricingData.reduce((acc, item) => acc + item.variacion, 0) / totalProducts;
  const totalStock = pricingData.reduce((acc, item) => acc + item.stock_actual, 0);
  const productsWithIncrease = pricingData.filter(item => item.variacion > 0).length;
  const totalCurrentValue = pricingData.reduce((acc, item) => acc + (item.precio_actual * item.stock_actual), 0);
  const totalSuggestedValue = pricingData.reduce((acc, item) => acc + (item.precio_sugerido * item.stock_actual), 0);
  const potentialRevenue = totalSuggestedValue - totalCurrentValue;

  return (
    <>
      <Header title="Agente de Pricing" />
      <main className="flex-1 flex flex-col gap-6 p-6 bg-slate-50">
        {/* Demo Interactive Section */}
        {showDemo ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-800">
                Consulta SKU y/o Producto
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(false)}
                className="flex items-center gap-2 bg-white hover:bg-slate-100"
              >
                ← Volver al Análisis
              </Button>
            </div>
            <PricingDemo />
          </div>
        ) : (
          <>
            {/* Demo Activation Button */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Demo Interactivo de Pricing</h3>
                      <p className="text-blue-100">
                        Prueba el agente IA consultando productos específicos por SKU
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowDemo(true)}
                    className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    <Search className="h-5 w-5" />
                    Ejecutar Análisis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-lg bg-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Productos</p>
                      <p className="text-3xl font-bold">{totalProducts}</p>
                      <p className="text-blue-100 text-sm">En análisis</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Variación Promedio</p>
                      <p className="text-3xl font-bold flex items-center">
                        {averageVariation > 0 ? (
                          <TrendingUp className="h-6 w-6 mr-2" />
                        ) : (
                          <TrendingDown className="h-6 w-6 mr-2" />
                        )}
                        {averageVariation.toFixed(1)}%
                      </p>
                      <p className="text-blue-100 text-sm">Cambio sugerido</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Stock Total</p>
                      <p className="text-3xl font-bold">{totalStock.toLocaleString()}</p>
                      <p className="text-blue-100 text-sm">Unidades disponibles</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Ingresos Potenciales</p>
                      <p className="text-3xl font-bold">${Math.abs(potentialRevenue).toLocaleString()}</p>
                      <p className="text-green-100 text-sm">
                        {potentialRevenue > 0 ? 'Incremento' : 'Optimización'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
        </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Productos */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-800 text-white">
                <CardTitle className="text-xl">Análisis Detallado de Productos</CardTitle>
                </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">SKU</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Producto</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Precio Actual</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Precio Sugerido</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Variación</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Stock</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingData.map((item, index) => (
                        <tr key={item.sku} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                          <td className="p-4 font-mono text-sm font-semibold text-blue-600">{item.sku}</td>
                          <td className="p-4 font-medium text-slate-800">{item.nombre}</td>
                          <td className="p-4 font-semibold text-slate-900">${item.precio_actual.toLocaleString()}</td>
                          <td className="p-4 font-semibold text-blue-600">${item.precio_sugerido.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`flex items-center font-semibold ${
                              item.variacion > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.variacion > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              {item.variacion.toFixed(2)}%
                            </span>
                          </td>
                          <td className="p-4 text-slate-700">{item.stock_actual.toLocaleString()}</td>
                          <td className="p-4">
                            {Math.abs(item.variacion) > 5 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Revisar
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                ✓ Óptimo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </CardContent>
            </Card>

            {/* Insights del Agente IA */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Insights del Agente IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-100 mb-2">Recomendación Principal</h4>
                    <p className="text-white">
                      Se recomienda ajustar precios en {productsWithIncrease} productos para mejorar 
                      competitividad. El impacto estimado es de ${Math.abs(potentialRevenue).toLocaleString()} 
                      en ingresos {potentialRevenue > 0 ? 'adicionales' : 'optimizados'}.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-100 mb-2">Próximos Pasos</h4>
                    <ul className="text-white space-y-1">
                      <li>• Validar precios con análisis de competencia</li>
                      <li>• Implementar cambios gradualmente</li>
                      <li>• Monitorear impacto en ventas</li>
                    </ul>
                  </div>
        </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </>
  );
} 