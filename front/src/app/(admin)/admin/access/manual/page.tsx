/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { manualEntry } from "@/hooks/use-manual-api";

export default function ManualEntryPage() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [kioskId, setKioskId] = useState("kiosk-1");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!employeeNumber) return toast.error("Ingresa el número de empleado");
    try {
      setLoading(true);
      await manualEntry(employeeNumber, kioskId);
      toast.success("Entrada registrada");
      setEmployeeNumber("");
    } catch (err: any) {
      toast.error(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm space-y-6">
      <h2 className="text-2xl font-bold text-[#7A2430]">Entrada manual</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Número de empleado</label>
        <Input
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          placeholder="Ej. EMP001"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Kiosco</label>
        <Select value={kioskId} onValueChange={setKioskId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kiosk-1">Entrada Principal</SelectItem>
            <SelectItem value="kiosk-2">Entrada Lateral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={submit}
        disabled={loading}
        className="bg-[#7A2430] hover:bg-[#7A2430]/90 w-full"
      >
        Registrar acceso
      </Button>
    </div>
  );
}
