import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  Bot,
  BarChart3,
  TrendingUp,
  Activity,
  Target
} from "lucide-react";
import logisticaData from "@/../data/logistica.json";
import pricingData from "@/../data/pricing.json";
import conciliacionData from "@/../data/conciliacion.json";

export default function DashboardPage() {
  const viajesEnCurso = logisticaData.filter(v => v.estado === 'En curso').length;
  const recomendacionesLogistica = logisticaData.filter(v => v.recomendaciones_ia.length > 0).length;
  const sugerenciasPricing = pricingData.filter(p => p.precio_sugerido !== p.precio_actual).length;
  const alertasConciliacion = conciliacionData.filter(c => c.estado !== '✅').length;
  
  // Métricas adicionales
  const totalAgentes = 4; // Logística, Pricing, Conciliación, Costos
  const totalRecomendaciones = recomendacionesLogistica + sugerenciasPricing;
  const procesamientosActivos = viajesEnCurso + sugerenciasPricing + alertasConciliacion;

  return (
    <>
      <Header title="Dashboard Contable" />
      <main className="flex flex-1 flex-col gap-6 p-6 bg-gray-50">
        {/* Header principal */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Contable</h1>
          <p className="text-gray-600">
            Gestión de conciliación bancaria con inteligencia artificial y análisis contable
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-lg bg-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Agentes Activos</p>
                  <p className="text-3xl font-bold">{totalAgentes}</p>
                  <p className="text-blue-100 text-sm">Sistemas operativos</p>
                </div>
                <Bot className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Procesamientos</p>
                  <p className="text-3xl font-bold">{procesamientosActivos}</p>
                  <p className="text-blue-100 text-sm">Tareas en curso</p>
                </div>
                <Activity className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Recomendaciones</p>
                  <p className="text-3xl font-bold">{totalRecomendaciones}</p>
                  <p className="text-green-100 text-sm">Insights generados</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Alertas</p>
                  <p className="text-3xl font-bold">{alertasConciliacion}</p>
                  <p className="text-orange-100 text-sm">Requieren atención</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado de Agentes por Categoría */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Estado de Agentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Agente de Logística</h4>
                      <p className="text-sm text-slate-600">{viajesEnCurso} viajes en curso</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Agente de Pricing</h4>
                      <p className="text-sm text-slate-600">{sugerenciasPricing} precios a optimizar</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                    Activo
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Agente de Conciliación</h4>
                      <p className="text-sm text-slate-600">{alertasConciliacion} alertas pendientes</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">
                    Alerta
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-slate-800">Agente de Costos</h4>
                      <p className="text-sm text-slate-600">Análisis en tiempo real</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                    Activo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="bg-slate-800 text-white">
              <CardTitle className="text-xl">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-slate-800">Nuevas recomendaciones de precio</h4>
                  <p className="text-sm text-slate-600">Agente de Pricing • Hace 5 min</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-slate-800">Optimización de ruta completada</h4>
                  <p className="text-sm text-slate-600">Agente de Logística • Hace 12 min</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-slate-800">Alertas de conciliación detectadas</h4>
                  <p className="text-sm text-slate-600">Agente de Conciliación • Hace 18 min</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-slate-800">Análisis de costos actualizado</h4>
                  <p className="text-sm text-slate-600">Agente de Costos • Hace 25 min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bienvenida */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-slate-700 to-slate-800 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-4 text-blue-300" />
              <h2 className="text-2xl font-bold mb-4">Bienvenido a la Plataforma de Agentes IA</h2>
              <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Este dashboard centraliza el monitoreo y control de todos los agentes de automatización 
                empresarial. Cada agente especializado procesa datos en tiempo real, genera 
                recomendaciones inteligentes y colabora seamlessly en el entorno corporativo.
              </p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{totalAgentes}</div>
                  <div className="text-sm text-slate-400">Agentes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{procesamientosActivos}</div>
                  <div className="text-sm text-slate-400">Procesos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-300">{totalRecomendaciones}</div>
                  <div className="text-sm text-slate-400">Insights</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">24/7</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
