"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react";

interface ResumenProps {
  balance: number;
  tipoBalance: string;
  liquidacion: number;
  conciliados: number;
  totalMovimientos: number;
  eficiencia: number;
}

export function ResumenEjecutivo({ 
  balance, 
  tipoBalance, 
  liquidacion, 
  conciliados, 
  totalMovimientos, 
  eficiencia 
}: ResumenProps) {
  const porcentajeConciliado = Math.round((conciliados / totalMovimientos) * 100);

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Resumen Ejecutivo - SmartIT</CardTitle>
            <p className="text-blue-100 text-sm">
              Gestión de conciliación bancaria con inteligencia artificial y análisis contable
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs">Empresa</p>
            <p className="text-white font-semibold">SmartIT</p>
            <div className="flex items-center gap-1 mt-1">
              <RefreshCw className="h-3 w-3 text-blue-200" />
              <span className="text-xs text-blue-200">Actualizado</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${balance.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">{tipoBalance}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">+5.2%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${liquidacion.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Flujo de Caja</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">+8.1%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {porcentajeConciliado}%
            </div>
            <p className="text-sm text-gray-600">Conciliación</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600">+2.3%</span>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {eficiencia}%
            </div>
            <p className="text-sm text-gray-600">Eficiencia</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-600">-1.2%</span>
            </div>
          </div>
        </div>

        {/* Estado de la Conciliación Bancaria */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Conciliación Bancaria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Conciliados</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{conciliados}</div>
              <p className="text-xs text-green-700">Sin discrepancias</p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-800">Pendientes</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{totalMovimientos - conciliados}</div>
              <p className="text-xs text-yellow-700">En revisión</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">Total</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{totalMovimientos}</div>
              <p className="text-xs text-blue-700">Registros procesados</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
