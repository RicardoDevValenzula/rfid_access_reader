"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search } from "lucide-react";

import { useAccessLogs } from "@/hooks/use-access-logs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccessLogsPage() {
  /* filtros */
  const [searchQuery, setSearchQuery] = useState("");
  const [kiosk, setKiosk] = useState<string>("all");

  /* paginación */
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);

  /* querystring */
  const params = new URLSearchParams({
    page: String(page),
    take: String(PAGE_SIZE),
    search: searchQuery,
  });
  if (kiosk !== "all") params.set("kioskId", kiosk);

  const { logs, total, isLoading } = useAccessLogs(params.toString());
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  /* reiniciar a página 1 cuando cambian filtros */
  useEffect(() => setPage(1), [searchQuery, kiosk]);

  /* lista dinámica de kioscos */
  const kiosks = React.useMemo(
    () => Array.from(new Set(logs.map((l) => l.kiosk))),
    [logs]
  );

  /* render */
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#7A2430]">
          Registros de Acceso
        </h2>
        <p className="text-muted-foreground">
          Visualiza y filtra los registros de acceso de los empleados.
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o número…"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={kiosk} onValueChange={setKiosk}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los kioscos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los kioscos</SelectItem>
              {kiosks.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border bg-white shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7A2430]" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Nº Empleado</TableHead>
                  <TableHead>Kiosco</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.timestamp), "HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.employeeName}
                    </TableCell>
                    <TableCell>{log.employeeNumber}</TableCell>
                    <TableCell>{log.kiosk}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          log.method === "RFID"
                            ? "bg-blue-100 text-blue-800"
                            : log.method === "FINGER"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {log.method === "RFID"
                          ? "Tarjeta"
                          : log.method === "FINGER"
                          ? "Huella"
                          : "Manual"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            <Pagination className="justify-end border-t p-4">
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
                <span className="px-3 py-2 text-sm">
                  {page} / {totalPages}
                </span>
                <PaginationNext
                  href="#"
                  onClick={() => page < totalPages && setPage(page + 1)}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
