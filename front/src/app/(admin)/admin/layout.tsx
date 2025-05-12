"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BarChart3, Users, Clock, LogIn, Menu, Bell, User } from "lucide-react";

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
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Toaster } from "sonner";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAdminAuth();

  useEffect(() => {
    // Solo redirigir si no está cargando y no está autenticado
    if (!isLoading && isAuthenticated === false) {
      router.push("/signin-admin");
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar un estado de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]"></div>
      </div>
    );
  }

  // No renderizar nada si no está autenticado (evita parpadeo antes de redirección)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8] text-gray-800">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-xl font-bold text-[#7A2430]">
            Control de Acceso
          </h2>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <SidebarItem
            icon={BarChart3}
            label="Dashboard"
            href="/admin"
            active={pathname === "/admin"}
          />
          <SidebarItem
            icon={Users}
            label="Empleados"
            href="/admin/employees"
            active={pathname === "/admin/employees"}
          />
          <SidebarItem
            icon={Clock}
            label="Registros de Acceso"
            href="/admin/access/logs"
            active={pathname === "/admin/access/logs"}
          />
          <SidebarItem
            icon={LogIn}
            label="Entrada Manual"
            href="/admin/access/manual"
            active={pathname === "/admin/access/manual"}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center border-b px-6">
                  <h2 className="text-xl font-bold text-[#7A2430]">
                    Control de Acceso
                  </h2>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                  <SidebarItem
                    icon={BarChart3}
                    label="Dashboard"
                    href="/admin"
                    active={pathname === "/admin"}
                  />
                  <SidebarItem
                    icon={Users}
                    label="Empleados"
                    href="/admin/employees"
                    active={pathname === "/admin/employees"}
                  />
                  <SidebarItem
                    icon={Clock}
                    label="Registros de Acceso"
                    href="/admin/access/logs"
                    active={pathname === "/admin/access/logs"}
                  />
                  <SidebarItem
                    icon={LogIn}
                    label="Entrada Manual"
                    href="/admin/access/manual"
                    active={pathname === "/admin/access/manual"}
                  />
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">Panel Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificaciones</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    router.push("/signin-admin");
                  }}
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
        <Toaster />
      </div>
    </div>
  );
}
