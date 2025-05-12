/* eslint-disable @typescript-eslint/no-explicit-any */
// front/src/app/admin/page.tsx  (o /admin/dashboard/page.tsx)
"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart3,
  Users,
  Clock,
  LogIn,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard();

  if (isLoading || !stats) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* ...encabezado idéntico ...*/}

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Users}
          label="Total Empleados"
          value={stats.totalEmployees}
          trend="+2 nuevos esta semana"
        />
        <KpiCard
          icon={Clock}
          label="Accesos Hoy"
          value={stats.totalAccessToday}
          trend="+12% respecto a ayer"
          trendIcon={ArrowUpRight}
          trendColor="text-green-500"
        />
        <KpiCard
          icon={LogIn}
          label="Pendientes de Registro"
          value={stats.pendingEmployees}
          trend="-2 respecto a ayer"
          trendIcon={ArrowDownRight}
          trendColor="text-red-500"
        />
        <KpiCard
          icon={BarChart3}
          label="Método Más Usado"
          value={
            stats.accessByMethod.sort(
              (a: { count: number }, b: { count: number }) => b.count - a.count
            )[0]?.method ?? "-"
          }
          trend={`${
            stats.accessByMethod.sort(
              (a: { count: number }, b: { count: number }) => b.count - a.count
            )[0]?.count ?? 0
          } accesos`}
        />
      </div>

      {/* Accesos recientes & Métodos */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentAccessCard logs={stats.recentAccess} />
        <MethodChartCard
          methods={stats.accessByMethod}
          total={stats.totalAccessToday}
        />
      </div>
    </div>
  );
}

/* ----- componentes auxiliares (misma página o separados) --------- */

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  trendIcon: TrendIcon,
  trendColor = "text-muted-foreground",
}: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trendColor}`}>
          {TrendIcon && <TrendIcon className="mr-1 inline h-3 w-3" />}
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

function RecentAccessCard({ logs }: { logs: any[] }) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Accesos Recientes</CardTitle>
        <CardDescription>Últimos 4 registros.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((a) => (
            <div key={a.id} className="flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E48A19]/20 text-[#E48A19]">
                {a.method === "Tarjeta" ? (
                  <LogIn className="h-4 w-4" />
                ) : a.method === "Huella" ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{a.employeeName}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(a.timestamp), "HH:mm", { locale: es })} – 
                  {a.kiosk}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  a.method === "Tarjeta"
                    ? "bg-blue-100 text-blue-800"
                    : a.method === "Huella"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {a.method}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <a href="/admin/access/logs">Ver todos</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

function MethodChartCard({
  methods,
  total,
}: {
  methods: { method: string; count: number }[];
  total: number;
}) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Métodos Hoy</CardTitle>
        <CardDescription>Participación por método.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {methods.map((m) => (
            <div key={m.method}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{m.method}</span>
                <span className="text-sm text-muted-foreground">
                  {m.count} ({total ? Math.round((m.count / total) * 100) : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${
                    m.method === "Tarjeta"
                      ? "bg-blue-500"
                      : m.method === "Huella"
                      ? "bg-green-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${total ? (m.count / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
