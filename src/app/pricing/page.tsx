import { Header } from "@/components/Header";
import { TableResumen } from "@/components/TableResumen";
import pricingData from "@/../data/pricing.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
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

const columns = [
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
  const mainAlert = pricingData[0]; // Show the first item's alert as the main one

  return (
    <>
      <Header title="Agente de Pricing" />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:gap-8 md:p-8">
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
      </main>
    </>
  );
} 