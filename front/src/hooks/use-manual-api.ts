import { api } from "@/lib/api";

export async function manualEntry(employeeNumber: string, kioskId: string) {
  await api("/access/manual", {
    method: "POST",
    body: JSON.stringify({ employeeNumber, kioskId }),
    headers: { "Content-Type": "application/json" },
  });
}
