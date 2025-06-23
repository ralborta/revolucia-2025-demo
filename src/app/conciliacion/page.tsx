import { Header } from "@/components/Header";
import { TableResumen } from "@/components/TableResumen";
import conciliacionData from "@/../data/conciliacion.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, FileDown, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type should ideally be shared or imported from a central types file
interface ConciliacionItem {
    id: string;
    fecha: string;
    descripcion: string;
    monto_contable: number;
    monto_bancario: number;
    estado: string;
}

const columns = [
  { header: "Fecha", accessorKey: "fecha" },
  { header: "Descripción", accessorKey: "descripcion" },
  { header: "Monto Contable", accessorKey: "monto_contable", cell: (row: ConciliacionItem) => `$${row.monto_contable.toFixed(2)}` },
  { header: "Monto Bancario", accessorKey: "monto_bancario", cell: (row: ConciliacionItem) => `$${row.monto_bancario.toFixed(2)}` },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: (row: ConciliacionItem) => {
      if (row.estado === '✅') return <CheckCircle className="h-5 w-5 text-green-500" />;
      if (row.estado === '⚠️') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      if (row.estado === '❌') return <XCircle className="h-5 w-5 text-red-500" />;
      return row.estado;
    },
  },
];

export default function ConciliacionPage() {
  const alertas = [
      "2 impuestos no registrados.",
      "Cobros duplicados detectados."
  ];

  return (
    <>
      <Header title="Agente de Conciliación" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Conciliación Bancaria y Contable</h2>
            <Button>
                <FileDown className="h-4 w-4 mr-2" />
                Generar Planilla de Rendición
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
                <TableResumen
                    columns={columns}
                    data={conciliacionData}
                />
            </div>
            <div className="md:col-span-1 space-y-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Alertas Críticas</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside">
                            {alertas.map(alerta => <li key={alerta}>{alerta}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
      </main>
    </>
  );
} 