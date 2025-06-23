import { Header } from "@/components/Header";
import { CardResumen } from "@/components/CardResumen";
import { DollarSign, Truck, AlertTriangle, CheckCircle } from "lucide-react";
import logisticaData from "@/../data/logistica.json";
import pricingData from "@/../data/pricing.json";
import conciliacionData from "@/../data/conciliacion.json";

export default function DashboardPage() {
  const viajesEnCurso = logisticaData.filter(v => v.estado === 'En curso').length;
  const recomendacionesLogistica = logisticaData.filter(v => v.recomendaciones_ia.length > 0).length;
  const sugerenciasPricing = pricingData.filter(p => p.precio_sugerido !== p.precio_actual).length;
  const alertasConciliacion = conciliacionData.filter(c => c.estado !== '✅').length;

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <CardResumen
            title="Logística: Viajes en Curso"
            value={String(viajesEnCurso)}
            description="Viajes activos en este momento."
            icon={Truck}
          />
          <CardResumen
            title="Pricing: Sugerencias Activas"
            value={String(sugerenciasPricing)}
            description="Productos con precios a optimizar."
            icon={DollarSign}
          />
          <CardResumen
            title="Conciliación: Alertas"
            value={String(alertasConciliacion)}
            description="Movimientos que requieren atención."
            icon={AlertTriangle}
          />
          <CardResumen
            title="Logística: Recomendaciones IA"
            value={String(recomendacionesLogistica)}
            description="Optimizaciones detectadas."
            icon={CheckCircle}
          />
        </div>
        <div className="grid gap-4 md:gap-8">
            <h2 className="text-xl font-semibold">Bienvenido a la Demo de Agentes IA</h2>
            <p className="text-muted-foreground">
                Usa la navegación de la izquierda para explorar las capacidades de cada agente de back office simulado.
                <br />
                Cada sección muestra cómo un agente especializado procesa datos, genera recomendaciones y colabora en un entorno corporativo.
            </p>
        </div>
      </main>
    </>
  );
}
