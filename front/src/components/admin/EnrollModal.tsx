"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function EnrollModal({
  open,
  onDone,
}: {
  open: boolean;
  onDone: (ok: boolean) => void; // callback para cerrar + toast
}) {
  const [state, setState] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    if (!open) return;
    const id = setInterval(async () => {
      const res = await fetch("http://localhost:3030/enroll/status");
      const { state } = await res.json();
      if (state === "success" || state === "error") {
        setState(state);
        clearInterval(id);
        setTimeout(() => onDone(state === "success"), 1200);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [open, onDone]);

  const icon =
    state === "pending" ? (
      <Loader2 className="h-10 w-10 animate-spin" />
    ) : state === "success" ? (
      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
    ) : (
      <XCircle className="h-10 w-10 text-red-600" />
    );

  const msg =
    state === "pending"
      ? "Acerca la tarjeta al lector…"
      : state === "success"
      ? "Tarjeta enrolada correctamente"
      : "Error al enrolar la tarjeta";

  return (
    <Dialog open={open}>
      <DialogContent className="text-center space-y-4">
        <DialogHeader>
          <DialogTitle>Enrolar tarjeta</DialogTitle>
        </DialogHeader>
        {icon}
        <p>{msg}</p>
      </DialogContent>
    </Dialog>
  );
}
