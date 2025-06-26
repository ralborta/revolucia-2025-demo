"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { LogisticaDemo } from "@/components/LogisticaDemo";
import { TableResumen, ColumnDef } from "@/components/TableResumen";
import { DetailPanel } from "@/components/DetailPanel";
import logisticaData from "@/../data/logistica.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  FileDown, 
  Bot,
  Search,
  Truck,
  MapPin,
  Clock,
  Fuel,
  Route,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const columns: ColumnDef<LogisticaItem>[] = [
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
  const [showDemo, setShowDemo] = useState(false);

  // Calcular métricas resumidas
  const totalViajes = logisticaData.length;
  const viajesCompletados = logisticaData.filter(item => item.estado === 'Completado').length;
  const viajesEnCurso = logisticaData.filter(item => item.estado === 'En curso').length;
  
  // Calcular KM totales
  const kmTotales = logisticaData.reduce((acc, item) => {
    if (item.km_final) {
      return acc + (item.km_final - item.km_inicial);
    }
    return acc;
  }, 0);

  // Unidades activas
  const unidadesActivas = new Set(logisticaData.map(item => item.unidad)).size;

  return (
    <>
      <Header title="Agente de Logística" />
      <main className="flex-1 flex flex-col gap-6 p-6 bg-slate-50">
        {/* Demo Interactive Section */}
        {showDemo ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-800">
                Monitoreo Inteligente de Logística
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(false)}
                className="flex items-center gap-2 bg-white hover:bg-slate-100"
              >
                ← Volver al Dashboard
              </Button>
            </div>
            <LogisticaDemo />
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
                      <h3 className="text-xl font-semibold text-white">Demo Interactivo de Logística</h3>
                      <p className="text-blue-100">
                        Prueba el agente IA para monitoreo de vehículos con WhatsApp integrado
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowDemo(true)}
                    className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    <Search className="h-5 w-5" />
                    Probar Demo
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
                      <p className="text-blue-100 text-sm font-medium">Total Viajes</p>
                      <p className="text-3xl font-bold">{totalViajes}</p>
                      <p className="text-blue-100 text-sm">Registrados</p>
                    </div>
                    <Route className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Completados</p>
                      <p className="text-3xl font-bold">{viajesCompletados}</p>
                      <p className="text-green-100 text-sm">Sin incidentes</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">En Curso</p>
                      <p className="text-3xl font-bold">{viajesEnCurso}</p>
                      <p className="text-orange-100 text-sm">Activos ahora</p>
                    </div>
                    <Truck className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">KM Totales</p>
                      <p className="text-3xl font-bold">{Math.round(kmTotales).toLocaleString()}</p>
                      <p className="text-purple-100 text-sm">Recorridos</p>
                    </div>
                    <MapPin className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de Estado y Unidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Truck className="h-6 w-6" />
                    Estado de Flota
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Unidades activas:</span>
                      <span className="font-semibold text-blue-600">{unidadesActivas}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">Completados:</span>
                      <span className="font-semibold text-green-600">{viajesCompletados}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600">En curso:</span>
                      <span className="font-semibold text-orange-600">{viajesEnCurso}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Promedio KM/viaje:</span>
                      <span className="font-semibold">{Math.round(kmTotales / totalViajes)} km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-slate-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="h-6 w-6" />
                    Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Eficiencia:</span>
                      <span className="font-semibold text-green-600">{Math.round((viajesCompletados / totalViajes) * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Viajes/día:</span>
                      <span className="font-semibold">{Math.round(totalViajes / 7)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">KM/día:</span>
                      <span className="font-semibold">{Math.round(kmTotales / 7).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Combustible est.:</span>
                      <span className="font-semibold">{Math.round(kmTotales / 12)}L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vista Tradicional - Tabla y Detalles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-slate-800 text-white">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Registro de Viajes</CardTitle>
                      <Button className="bg-white text-slate-800 hover:bg-slate-100">
                        <FileDown className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
            <TableResumen
                columns={columns}
                data={logisticaData}
                onRowClick={(row) => setSelectedItem(row as LogisticaItem)}
            />
                  </CardContent>
                </Card>
        </div>
        <div className="md:col-span-1">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-blue-600 text-white">
                    <CardTitle className="text-xl">Detalles del Viaje</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
             <DetailPanel item={selectedItem} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Alertas y Recomendaciones del Agente IA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertas Críticas */}
              <Card className="border-none shadow-lg border-orange-200 bg-orange-50">
                <CardHeader className="bg-orange-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Alertas de Logística
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                      <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-900">Viajes en curso</p>
                        <p className="text-sm text-orange-700">{viajesEnCurso} unidades requieren seguimiento</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-200">
                      <Fuel className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-orange-900">Consumo combustible</p>
                        <p className="text-sm text-orange-700">Alto consumo detectado en ruta Buenos Aires</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights del Agente IA */}
              <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    Insights del Agente IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-100 mb-2">Recomendación Principal</h4>
                      <p className="text-white text-sm">
                        {selectedItem?.recomendaciones_ia?.[0] || "Se recomienda optimizar las rutas de distribución para reducir tiempos de viaje y consumo de combustible."}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-100 mb-2">Próximos Pasos</h4>
                      <ul className="text-white text-sm space-y-1">
                        <li>• Implementar seguimiento GPS en tiempo real</li>
                        <li>• Capacitar conductores en rutas optimizadas</li>
                        <li>• Establecer comunicación vía WhatsApp</li>
                        <li>• Monitorear consumo de combustible</li>
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