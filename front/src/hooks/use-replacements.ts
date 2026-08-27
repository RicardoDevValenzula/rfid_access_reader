import { api } from "@/lib/api";
import { Replacement } from "./types";

export interface CreateReplacementPayload {
  originalEmployeeNumber: string;
  number?: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  pension?: string;
  dependencia?: string;
  telefono?: string;
  tipo?: string;
  kioskId?: string;
}

export async function createReplacement(payload: CreateReplacementPayload) {
  return api<Replacement>("/replacements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
