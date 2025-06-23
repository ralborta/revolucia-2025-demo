"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { TableResumen, ColumnDef } from "@/components/TableResumen";
import { PricingDemo } from "@/components/PricingDemo";
import pricingData from "@/../data/pricing.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingDown, TrendingUp, Bot, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This type should ideally be shared or imported from a central types file
interface PricingItem {
  id: string;
  sku: string;
  nombre: string;
  precio_actual: number;
  precio_sugerido: number;
  variacion: number;
  stock_actual: number;
  mensaje_agente: string;
}

const columns: ColumnDef<PricingItem>[] = [
  { header: "SKU", accessorKey: "sku" },
  { header: "Producto", accessorKey: "nombre" },
  { header: "Precio Actual", accessorKey: "precio_actual", cell: (row: PricingItem) => `$${row.precio_actual}` },
  { header: "Precio Sugerido", accessorKey: "precio_sugerido", cell: (row: PricingItem) => `$${row.precio_sugerido}` },
  {
    header: "Variación",
    accessorKey: "variacion",
    cell: (row: PricingItem) => {
      const isUp = row.variacion > 0;
      return (
        <span className={`flex items-center ${isUp ? "text-green-600" : "text-red-600"}`}>
          {isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          {row.variacion.toFixed(2)}%
        </span>
      );
    },
  },
  { header: "Stock", accessorKey: "stock_actual" },
];

export default function PricingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const mainAlert = pricingData[0]; // Show the first item's alert as the main one

  return (
    <>
      <Header title="Agente de Pricing" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Demo Interactive Section */}
        {showDemo ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🧠 Demo Interactivo - Consulta por SKU
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(false)}
                className="flex items-center gap-2"
              >
                ← Volver al Análisis
              </Button>
            </div>
            <PricingDemo />
          </div>
        ) : (
          <>
            {/* Demo Activation Button */}
            <div className="w-full">
              <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Demo Interactivo de Pricing</h3>
                        <p className="text-sm text-muted-foreground">
                          Prueba el agente IA consultando productos específicos por SKU
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowDemo(true)}
                      className="flex items-center gap-2"
                      size="lg"
                    >
                      <Search className="h-4 w-4" />
                      Probar Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regular Pricing Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Análisis de Productos</h2>
                  <TableResumen
                      columns={columns}
                      data={pricingData.map(p => ({...p, id: p.sku}))}
                  />
              </div>
              <div className="md:col-span-1 space-y-4">
                  <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertTitle>Sugerencia Principal</AlertTitle>
                      <AlertDescription>
                          {mainAlert.mensaje_agente}
                          <p className="text-xs text-muted-foreground mt-2">{mainAlert.interaccion_costos}</p>
                      </AlertDescription>
                  </Alert>
                  <Card>
                      <CardHeader>
                          <CardTitle>Ritmo de Ventas (Simulado)</CardTitle>
                      </CardHeader>
                      <CardContent className="h-64 bg-muted flex items-center justify-center rounded-md">
                          <p className="text-muted-foreground">[Gráfico de ventas estático]</p>
                      </CardContent>
                  </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
} 