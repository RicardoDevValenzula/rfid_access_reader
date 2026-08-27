"use client";

import {
  useAttendanceReport,
  useReplacedReport,
  useAbsentReport,
} from "@/hooks/use-reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "@/lib/export-excel";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ReportsPage() {
  const { data: attendance, isLoading: loadingAttendance } =
    useAttendanceReport();
  const { data: replaced, isLoading: loadingReplaced } = useReplacedReport();
  const { data: absent, isLoading: loadingAbsent } = useAbsentReport();

  function handleExport() {
    exportToExcel(`reportes-${new Date().toISOString().slice(0, 10)}.xlsx`, {
      Asistencia: attendance.map((row) => ({
        Nombre: row.name,
        Número: row.number,
        Accesos: row.accessCount,
        "Último acceso": formatDate(row.lastAccessAt),
      })),
      Reemplazos: replaced.map((row) => ({
        "Empleado original": row.originalEmployee.name,
        "Número original": row.originalEmployee.number,
        Reemplazante: row.replacementEmployee.name,
        "Número reemplazante": row.replacementEmployee.number,
        Fecha: formatDate(row.createdAt),
      })),
      Ausentes: absent.map((row) => ({
        Nombre: row.name,
        Número: row.number,
      })),
    });
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#7A2430]">Reportes</h2>
          <p className="text-muted-foreground">
            Asistencia, reemplazos y ausencias de los empleados.
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={loadingAttendance || loadingReplaced || loadingAbsent}
          className="bg-[#7A2430] hover:bg-[#7A2430]/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Descargar Excel
        </Button>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#7A2430]">Asistencia</h3>
        <div className="rounded-lg border bg-white shadow-sm">
          {loadingAttendance ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead className="text-right">Accesos</TableHead>
                  <TableHead>Último acceso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.number}</TableCell>
                    <TableCell className="text-right">
                      {row.accessCount}
                    </TableCell>
                    <TableCell>{formatDate(row.lastAccessAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#7A2430]">Reemplazados</h3>
        <div className="rounded-lg border bg-white shadow-sm">
          {loadingReplaced ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado original</TableHead>
                  <TableHead>Reemplazante</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {replaced.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.originalEmployee.name} ({row.originalEmployee.number})
                    </TableCell>
                    <TableCell>
                      {row.replacementEmployee.name} ({row.replacementEmployee.number})
                    </TableCell>
                    <TableCell>{formatDate(row.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#7A2430]">Ausentes</h3>
        <div className="rounded-lg border bg-white shadow-sm">
          {loadingAbsent ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Número</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {absent.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}
