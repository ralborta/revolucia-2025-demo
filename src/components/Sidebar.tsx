"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Truck, DollarSign, Landmark, Combine, User } from "lucide-react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Logística", href: "/logistica", icon: Truck },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
  { name: "Conciliación", href: "/conciliacion", icon: Landmark },
  { name: "Costos", href: "/costos", icon: Combine },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-slate-900 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-slate-700 px-6">
          <Link className="flex items-center gap-2 font-semibold text-white" href="/">
            <Image 
              src="/logo.svg" 
              alt="Logo Empliados" 
              width={24} 
              height={24}
              className="h-6 w-6"
            />
            <span>Plataforma Empl<span className="text-orange-400">ia</span>dos</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 px-3 py-2">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-white">Raúl</div>
              <div className="text-slate-400">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 