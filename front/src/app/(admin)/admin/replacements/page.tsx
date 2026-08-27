/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createReplacement } from "@/hooks/use-replacements";

export default function ReplacementsPage() {
  const [originalEmployeeNumber, setOriginalEmployeeNumber] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pension, setPension] = useState("");
  const [dependencia, setDependencia] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setOriginalEmployeeNumber("");
    setNumber("");
    setName("");
    setEmail("");
    setTelefono("");
    setPension("");
    setDependencia("");
    setTipo("");
  };

  const submit = async () => {
    if (!originalEmployeeNumber)
      return toast.error("Ingresa el número del empleado original");
    if (!number && !email)
      return toast.error("Ingresa el número o el email del reemplazante");
    try {
      setLoading(true);
      await createReplacement({
        originalEmployeeNumber,
        number: number || undefined,
        name: name || undefined,
        email: email || undefined,
        telefono: telefono || undefined,
        pension: pension || undefined,
        dependencia: dependencia || undefined,
        tipo: tipo || undefined,
      });
      toast.success("Reemplazo registrado");
      reset();
    } catch (err: any) {
      toast.error(err.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm space-y-6">
      <h2 className="text-2xl font-bold text-[#7A2430]">Reemplazos</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Número de empleado original
        </label>
        <Input
          value={originalEmployeeNumber}
          onChange={(e) => setOriginalEmployeeNumber(e.target.value)}
          placeholder="Ej. EMP001"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Número de empleado (reemplazante)</label>
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Ej. EMP002"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre (reemplazante)</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email (reemplazante)</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Teléfono</label>
        <Input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: 555-1234"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Pensión</label>
        <Input
          value={pension}
          onChange={(e) => setPension(e.target.value)}
          placeholder="Pensión"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dependencia</label>
        <Input
          value={dependencia}
          onChange={(e) => setDependencia(e.target.value)}
          placeholder="Dependencia"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo</label>
        <Input
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          placeholder="Tipo"
        />
      </div>

      <Button
        onClick={submit}
        disabled={loading}
        className="bg-[#7A2430] hover:bg-[#7A2430]/90 w-full"
      >
        Registrar reemplazo
      </Button>
    </div>
  );
}
