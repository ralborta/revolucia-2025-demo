"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Truck, DollarSign, Landmark, Combine, User, Bot, TrendingUp, Clock } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Conciliación", href: "/conciliacion", icon: Landmark },
  { name: "Logística", href: "/logistica", icon: Truck },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "Costos", href: "/costos", icon: Combine },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-white shadow-sm md:block">
      <div className="flex h-full max-h-screen flex-col">
        {/* Header */}
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link className="flex items-center gap-2 font-bold text-gray-900" href="/">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg">Conciliador <span className="text-blue-600">IA</span></span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-blue-600" : "text-gray-400"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Status Card */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Estado del Sistema</span>
            </div>
            <p className="text-xs text-green-700">Todos los agentes operando</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">98.5% de precisión</span>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Actividad Reciente</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-blue-700">
                <span className="font-medium">74</span> conciliados
              </div>
              <div className="text-xs text-blue-700">
                <span className="font-medium">24</span> pendientes
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Raúl</div>
              <div className="text-gray-500">Analista</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 