import { Header } from "@/components/Header";
import { TableResumen, ColumnDef } from "@/components/TableResumen";
import costosData from "@/../data/costos.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Users } from "lucide-react";

// This type should ideally be shared or imported from a central types file
interface CostoItem {
    id: string;
    insumo: string;
    costo_actual: number;
    variacion_esperada: number;
    impacto_operativo: string;
    mensaje_ia: string;
}

const columns: ColumnDef<CostoItem>[] = [
  { header: "Insumo / Servicio", accessorKey: "insumo" },
  { header: "Costo Actual", accessorKey: "costo_actual", cell: (row: CostoItem) => `$${row.costo_actual.toFixed(2)}` },
  { header: "Variación Esperada", accessorKey: "variacion_esperada", cell: (row: CostoItem) => `${row.variacion_esperada.toFixed(1)}%` },
  { header: "Impacto Operativo", accessorKey: "impacto_operativo" },
];

export default function CostosPage() {
  const mainAlert = costosData[0]; // Show the first item's alert as the main one

  return (
    <>
      <Header title="Agente de Costos" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h2 className="text-xl font-semibold">Análisis de Costos Actuales y Proyectados</h2>
        <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
                <TableResumen
                    columns={columns}
                    data={costosData}
                />
            </div>
            <div className="md:col-span-1 space-y-4">
                <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Sugerencia Principal</AlertTitle>
                    <AlertDescription>
                        {mainAlert.mensaje_ia}
                    </AlertDescription>
                </Alert>
                <div className="p-4 border rounded-md">
                    <h3 className="font-semibold mb-2 flex items-center"><Users className="h-4 w-4 mr-2"/> Colaboración IA</h3>
                    <p className="text-sm text-muted-foreground">El agente de Pricing ha sido notificado sobre la variación de costos para ajustar sus modelos.</p>
                    <a href="/pricing" className="text-sm text-primary hover:underline mt-2 inline-block">Ver análisis de Pricing</a>
                </div>
            </div>
        </div>
      </main>
    </>
  );
} 