"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualPage() {
  const [number, setNumber] = useState("");
  const router = useRouter();

  async function submit() {
    await fetch("http://localhost:3000/access/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeNumber: Number(number),
        kioskId: "kiosk-1",
      }),
    });
    router.push("/kiosk"); // vuelve a la pantalla principal
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl">Entrada manual</h1>
      <input
        className="text-black px-3 py-2 rounded"
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Número de empleado"
      />
      <button className="bg-green-600 px-4 py-2 rounded" onClick={submit}>
        Registrar
      </button>
      <button className="underline mt-6" onClick={() => router.push("/kiosk")}>
        Cancelar
      </button>
    </div>
  );
}
