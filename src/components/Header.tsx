"use client";

import Link from "next/link";
import {
  Bot,
  CircleUser,
  Home,
  Landmark,
  Combine,
  Menu,
  Truck,
  DollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/logistica", label: "Logística", icon: Truck },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/conciliacion", label: "Conciliación", icon: Landmark },
    { href: "/costos", label: "Costos", icon: Combine },
];

export function Header({ title }: { title: string }) {
    const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Bot className="h-6 w-6" />
              <span>Agentes IA Demo</span>
            </Link>
            {navLinks.map(link => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${isActive ? "bg-muted text-foreground" : ""}`}
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </Link>
                )
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
} 