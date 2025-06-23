import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { ChatBubble } from "./ChatBubble";

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

interface DetailPanelProps {
  item: LogisticaItem | null;
}

export function DetailPanel({ item }: DetailPanelProps) {
  if (!item) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Selecciona un viaje para ver los detalles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle del Viaje: {item.id}</CardTitle>
        <CardDescription>{item.unidad} - {item.ruta}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Papeleta de Viaje</h3>
          {item.papeleta_img ? (
            <Image
              src={item.papeleta_img}
              alt={`Papeleta del viaje ${item.id}`}
              width={400}
              height={500}
              className="rounded-md border"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No hay imagen de papeleta para este viaje.</p>
          )}
        </div>

        <div>
            <h3 className="font-semibold mb-2">Chat con Transportista (Simulado)</h3>
            <div className="p-4 border rounded-md bg-slate-50">
                {item.chat_simulado.length > 0 ? (
                    item.chat_simulado.map((chat, index) => (
                        <ChatBubble key={index} autor={chat.autor} mensaje={chat.mensaje} />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No hay mensajes en este chat.</p>
                )}
            </div>
        </div>

        <div>
            <h3 className="font-semibold mb-2">Recomendaciones IA</h3>
             {item.recomendaciones_ia.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-800 bg-amber-50 p-3 rounded-md">
                    {item.recomendaciones_ia.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
             ) : (
                <p className="text-sm text-muted-foreground">No hay recomendaciones para este viaje.</p>
             )}
        </div>
      </CardContent>
    </Card>
  );
} 