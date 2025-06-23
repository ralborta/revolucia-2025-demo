"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { TableResumen } from "@/components/TableResumen";
import { DetailPanel } from "@/components/DetailPanel";
import logisticaData from "@/../data/logistica.json";
import { Badge } from "@/components/ui/badge";

// This type should ideally be shared or imported from a central types file
interface LogisticaItem {
    id: string;
    unidad: string;
    ruta: string;
    km_inicial: number;
    km_final: number | null;
    fecha: string;
    estado: string;
    papeleta_img: string | null;
    chat_simulado: { autor: string; mensaje: string }[];
    recomendaciones_ia: string[];
}

const columns = [
  { header: "ID Viaje", accessorKey: "id" },
  { header: "Unidad", accessorKey: "unidad" },
  { header: "Ruta", accessorKey: "ruta" },
  { header: "Fecha", accessorKey: "fecha" },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: (row: LogisticaItem) => {
        let variant: "default" | "secondary" | "destructive" = "default";
        if (row.estado === 'Completado') variant = 'secondary';
        if (row.estado === 'En curso') variant = 'default';
        return <Badge variant={variant}>{row.estado}</Badge>
    }
  },
];

export default function LogisticaPage() {
  const [selectedItem, setSelectedItem] = useState<LogisticaItem | null>(logisticaData[0]);

  return (
    <>
      <Header title="Agente de Logística" />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:gap-8 md:p-8">
        <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Registro de Viajes</h2>
            <TableResumen
                columns={columns}
                data={logisticaData}
                onRowClick={(row) => setSelectedItem(row as LogisticaItem)}
            />
        </div>
        <div className="md:col-span-1">
             <DetailPanel item={selectedItem} />
        </div>
      </main>
    </>
  );
} 