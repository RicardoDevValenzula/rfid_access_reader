/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2, ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEmployees } from "@/hooks/useEmployees";
import { useWriterScan } from "@/hooks/use-writer-scan";
import { createReplacement } from "@/hooks/use-replacements";
import { api } from "@/lib/api";
import { Employee } from "@/hooks/types";
import { cn } from "@/lib/utils";

// Kiosco "virtual" para los accesos registrados manualmente desde el
// panel de reemplazos, para poder distinguirlos en logs/reportes.
const REPLACEMENT_KIOSK_ID = "admin-reemplazos";

export default function ReplacementsPage() {
  const { data: employees } = useEmployees();
  const scan = useWriterScan();

  const [originalOpen, setOriginalOpen] = useState(false);
  const [originalEmployee, setOriginalEmployee] = useState<Employee | null>(
    null
  );

  const [scannedUid, setScannedUid] = useState<string | null>(null);
  const [matchedEmployee, setMatchedEmployee] = useState<Employee | null>(
    null
  );
  const [checkingUid, setCheckingUid] = useState(false);

  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [linking, setLinking] = useState(false);

  const [confirming, setConfirming] = useState(false);

  // Cuando el writer detecta un tag, lo buscamos contra la API: si ya
  // tiene dueño, ese mismo tap queda registrado como su asistencia.
  useEffect(() => {
    if (scan.status !== "success" || !scan.uid) return;

    setScannedUid(scan.uid);
    setMatchedEmployee(null);
    setCheckingUid(true);

    (async () => {
      try {
        const res = await api<{ ok: boolean; employee?: Employee }>(
          "/access/card-read",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: scan.uid,
              kioskId: REPLACEMENT_KIOSK_ID,
            }),
          }
        );
        if (res.ok && res.employee) {
          setMatchedEmployee(res.employee);
          toast.success(`Tag identificado: ${res.employee.name}`);
        } else {
          toast.message("Este tag no está vinculado a nadie todavía");
        }
      } catch (err: any) {
        toast.error(err.message ?? "Error al identificar el tag");
      } finally {
        setCheckingUid(false);
        scan.reset();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scan.status, scan.uid]);

  async function handleLinkNew() {
    if (!scannedUid) return;
    if (!newNumber || !newName)
      return toast.error("Ingresa número y nombre del reemplazante");

    try {
      setLinking(true);
      await api("/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: newNumber, name: newName }),
      });
      await api("/employees/link-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: scannedUid, employeeNumber: newNumber }),
      });
      const res = await api<{ ok: boolean; employee?: Employee }>(
        "/access/card-read",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: scannedUid,
            kioskId: REPLACEMENT_KIOSK_ID,
          }),
        }
      );
      setMatchedEmployee(res.employee ?? null);
      setNewNumber("");
      setNewName("");
      toast.success("Empleado creado y tarjeta vinculada");
    } catch (err: any) {
      toast.error(err.message ?? "Error al vincular la tarjeta");
    } finally {
      setLinking(false);
    }
  }

  async function handleConfirm() {
    if (!originalEmployee || !matchedEmployee) return;
    try {
      setConfirming(true);
      await createReplacement({
        originalEmployeeNumber: String(originalEmployee.number),
        number: String(matchedEmployee.number),
      });
      toast.success(
        `${originalEmployee.name} fue reemplazado por ${matchedEmployee.name}`
      );
      setOriginalEmployee(null);
      setMatchedEmployee(null);
      setScannedUid(null);
    } catch (err: any) {
      toast.error(err.message ?? "Error al registrar el reemplazo");
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#7A2430]">Reemplazos</h2>
        <p className="text-sm text-muted-foreground">
          Elegí quién no vino y escaneá el tag de quien viene en su lugar.
        </p>
      </div>

      {/* Paso 1: quién no vino — no está físicamente para tocar su tag,
          así que se busca por nombre/número. */}
      <div className="space-y-2">
        <label className="text-sm font-medium">1. Empleado que no vino</label>
        <Popover open={originalOpen} onOpenChange={setOriginalOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
            >
              {originalEmployee
                ? `${originalEmployee.name} (#${originalEmployee.number})`
                : "Buscar empleado…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Nombre o número…" />
              <CommandList>
                <CommandEmpty>Sin resultados</CommandEmpty>
                <CommandGroup>
                  {(employees ?? []).map((e) => (
                    <CommandItem
                      key={e.id}
                      value={`${e.number} ${e.name}`}
                      onSelect={() => {
                        setOriginalEmployee(e);
                        setOriginalOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          originalEmployee?.id === e.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {e.name} (#{e.number})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Paso 2: quién viene en su lugar — este sí está presente, se
          identifica tocando su propio tag. */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          2. Tag de quien lo reemplaza
        </label>

        <Button
          onClick={scan.start}
          disabled={scan.status === "waiting" || checkingUid}
          variant="outline"
          className="w-full"
        >
          {scan.status === "waiting" || checkingUid ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Acerca la tarjeta al lector…
            </>
          ) : (
            <>
              <ScanLine className="mr-2 h-4 w-4" />
              Escanear tag del reemplazante
            </>
          )}
        </Button>

        {scan.status === "error" && (
          <p className="text-sm font-medium text-red-600">
            Writer no detectado, por favor verificar conexión
          </p>
        )}

        {matchedEmployee && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm">
            <span className="font-medium">{matchedEmployee.name}</span>{" "}
            (#{matchedEmployee.number}) — asistencia registrada.
          </div>
        )}

        {scannedUid && !matchedEmployee && !checkingUid && (
          <div className="space-y-2 rounded-md border p-3">
            <p className="text-sm text-muted-foreground">
              Este tag no está asignado a nadie. Dalo de alta para vincularlo:
            </p>
            <Input
              placeholder="Número de empleado"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
            />
            <Input
              placeholder="Nombre completo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button
              onClick={handleLinkNew}
              disabled={linking}
              size="sm"
              className="w-full"
            >
              {linking ? "Vinculando…" : "Crear empleado y vincular tag"}
            </Button>
          </div>
        )}
      </div>

      <Button
        onClick={handleConfirm}
        disabled={!originalEmployee || !matchedEmployee || confirming}
        className="w-full bg-[#7A2430] hover:bg-[#7A2430]/90"
      >
        {confirming ? "Registrando…" : "Confirmar reemplazo"}
      </Button>
    </div>
  );
}
