"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ConciliacionDemo } from "@/components/ConciliacionDemo";
import { ResumenEjecutivo } from "@/components/ResumenEjecutivo";
import conciliacionData from "@/../data/conciliacion.json";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  FileDown, 
  CheckCircle2, 
  XCircle, 
  Bot,
  Search,
  Calculator,
  BarChart3,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";

// This type should ideally be shared or imported from a central types file
interface ConciliacionItem {
    id: string;
    fecha: string;
    descripcion: string;
    monto_contable: number;
    monto_bancario: number;
    estado: string;
}

export default function ConciliacionPage() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [fileName, setFileName] = useState("");

  // Calcular métricas resumidas
  const totalMovimientos = conciliacionData.length;
  const conciliados = conciliacionData.filter(item => item.estado === '✅').length;
  const noRegistrados = conciliacionData.filter(item => item.estado === '⚠️').length;
  const diferencias = conciliacionData.filter(item => item.estado === '❌').length;
  const totalBancario = conciliacionData.reduce((acc, item) => acc + item.monto_bancario, 0);
  const totalContable = conciliacionData.reduce((acc, item) => acc + item.monto_contable, 0);
  const diferenciaMonto = Math.abs(totalBancario - totalContable);

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "✅": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "⚠️": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "❌": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "✅": return "Conciliado";
      case "⚠️": return "No registrado";
      case "❌": return "Diferencia";
      default: return estado;
    }
  };

  const handleExportPDF = (customName?: string) => {
    const doc = new jsPDF();
    const today = new Date();
    const fecha = today.toLocaleDateString();
    // Título y encabezado
    doc.setFontSize(18);
    doc.text("Reporte de Conciliación – " + fecha, 14, 20);
    doc.setFontSize(12);
    doc.text("Empresa: Empliados", 14, 30);
    doc.text("Usuario: Test", 14, 37);
    // KPIs principales
    doc.setFontSize(14);
    doc.text("Métricas Principales", 14, 50);
    doc.setFontSize(12);
    doc.text(`Total Movimientos: ${totalMovimientos}`, 14, 58);
    doc.text(`Conciliados: ${conciliados}`, 14, 65);
    doc.text(`Pendientes: ${noRegistrados + diferencias}`, 14, 72);
    doc.text(`Diferencia Total: $${Math.round(diferenciaMonto).toLocaleString()}`, 14, 79);
    doc.text(`Balance Bancario: $${totalBancario.toLocaleString()}`, 14, 86);
    doc.text(`Balance Contable: $${totalContable.toLocaleString()}`, 14, 93);
    // Alertas críticas
    doc.setFontSize(14);
    doc.text("Alertas Críticas", 14, 110);
    doc.setFontSize(12);
    doc.text(`• ${diferencias} movimientos con discrepancias`, 14, 118);
    doc.text(`• ${noRegistrados} transacciones no registradas`, 14, 125);
    doc.text(`• Diferencia total: $${Math.round(diferenciaMonto).toLocaleString()}`, 14, 132);
    // Recomendaciones del agente IA
    doc.setFontSize(14);
    doc.text("Recomendaciones del Agente IA", 14, 145);
    doc.setFontSize(12);
    doc.text(`• Revisar movimientos no registrados`, 14, 153);
    doc.text(`• Validar diferencias con el área contable`, 14, 160);
    doc.text(`• Solicitar auditoría de transacciones`, 14, 167);
    doc.text(`• Actualizar registros contables`, 14, 174);
    // Tabla de movimientos (página 2)
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Movimientos de Conciliación", 14, 20);
    doc.setFontSize(10);
    let y = 30;
    conciliacionData.forEach((item) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${item.id} - ${item.fecha} - ${item.descripcion}`, 14, y);
      doc.text(`Bancario: $${item.monto_bancario.toLocaleString()} | Contable: $${item.monto_contable.toLocaleString()} | Estado: ${item.estado}`, 14, y + 5);
      y += 12;
    });
    // Guardar PDF
    const defaultName = `reporte_conciliacion_${fecha}.pdf`;
    doc.save(customName || defaultName);
  };

  return (
    <>
      <Header title="Dashboard Contable" />
      <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-50">
        {/* Analysis Interactive Section */}
        {showAnalysis ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-800">
                Análisis Inteligente de Conciliación
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowAnalysis(false)}
                className="flex items-center gap-2 bg-white hover:bg-slate-100"
              >
                ← Volver al Dashboard
              </Button>
            </div>
            <ConciliacionDemo />
          </div>
        ) : (
          <>
            {/* Resumen Ejecutivo */}
            <ResumenEjecutivo 
              balance={totalBancario}
              tipoBalance="Balance"
              liquidacion={700000}
              conciliados={conciliados}
              totalMovimientos={totalMovimientos}
              eficiencia={Math.round((conciliados / totalMovimientos) * 100)}
            />

            {/* Analysis Activation Button */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Análisis Inteligente de Conciliación</h3>
                      <p className="text-blue-100">
                        Ejecuta el agente IA para conciliación bancaria, contable y fiscal
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowAnalysis(true)}
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
                      <p className="text-blue-100 text-sm font-medium">Total Movimientos</p>
                      <p className="text-3xl font-bold">{totalMovimientos}</p>
                      <p className="text-blue-100 text-sm">Registros analizados</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Conciliados</p>
                      <p className="text-3xl font-bold">{conciliados}</p>
                      <p className="text-green-100 text-sm">Sin discrepancias</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Pendientes</p>
                      <p className="text-3xl font-bold">{noRegistrados + diferencias}</p>
                      <p className="text-yellow-100 text-sm">Requieren revisión</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Diferencia Total</p>
                      <p className="text-3xl font-bold">${Math.round(diferenciaMonto).toLocaleString()}</p>
                      <p className="text-red-100 text-sm">Desbalance detectado</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    Balance Bancario
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      ${totalBancario.toLocaleString()}
                    </div>
                    <p className="text-slate-600">Saldo según extractos bancarios</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader className="bg-green-600 text-white">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    Balance Contable
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${totalContable.toLocaleString()}
                    </div>
                    <p className="text-slate-600">Saldo según registros contables</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de Movimientos Detallada */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-slate-800 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Movimientos de Conciliación</CardTitle>
                  <Button 
                    className="bg-white text-slate-800 hover:bg-slate-100"
                    onClick={() => setShowExportModal(true)}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">ID</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Fecha</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Descripción</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Monto Bancario</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Monto Contable</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conciliacionData.map((item: ConciliacionItem, index) => (
                        <tr key={item.id} className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                          <td className="p-4 font-mono text-sm font-semibold text-purple-600">{item.id}</td>
                          <td className="p-4 font-medium text-slate-800">{item.fecha}</td>
                          <td className="p-4 text-slate-700">{item.descripcion}</td>
                          <td className="p-4 font-semibold text-slate-900">
                            ${item.monto_bancario.toLocaleString()}
                          </td>
                          <td className="p-4 font-semibold text-slate-900">
                            ${item.monto_contable.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.estado)}
                              <span className="text-sm font-medium">
                                {getStatusText(item.estado)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Alertas y Recomendaciones del Agente IA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertas Críticas */}
              <Card className="border-none shadow-lg border-red-200 bg-red-50">
                <CardHeader className="bg-red-600 text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Alertas Críticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Diferencias de monto detectadas</p>
                        <p className="text-sm text-red-700">{diferencias} movimientos con discrepancias</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Movimientos no registrados</p>
                        <p className="text-sm text-red-700">{noRegistrados} transacciones pendientes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights del Agente IA */}
              <Card className="border-none shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-6 w-6" />
                    Insights del Agente IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-purple-100 mb-2">Recomendación Principal</h4>
                      <p className="text-white text-sm">
                        Se detectaron {noRegistrados + diferencias} discrepancias que requieren atención inmediata. 
                        La diferencia total de ${Math.round(diferenciaMonto).toLocaleString()} debe ser investigada.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-100 mb-2">Próximos Pasos</h4>
                      <ul className="text-white text-sm space-y-1">
                        <li>• Revisar movimientos no registrados</li>
                        <li>• Validar diferencias con el área contable</li>
                        <li>• Solicitar auditoría de transacciones</li>
                        <li>• Actualizar registros contables</li>
                        </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Modal de Exportación */}
            {showExportModal && (
              <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Exportar Reporte a PDF</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nombre del archivo:
                      </label>
                      <Input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="reporte_conciliacion_2024-01-15.pdf"
                        className="w-full"
                      />
                    </div>
                    <p className="text-sm text-slate-600">
                      El PDF incluirá: KPIs principales, tabla completa de movimientos, alertas críticas y recomendaciones del agente IA.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowExportModal(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => { handleExportPDF(fileName); setShowExportModal(false); }}>
                      Exportar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </main>
    </>
  );
} 