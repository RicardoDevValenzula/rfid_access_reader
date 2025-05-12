// front/src/hooks/use-dashboard.ts
"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import { io } from "socket.io-client";
import { useEffect } from "react";

interface DashboardStats {
  totalEmployees: number;
  pendingEmployees: number;
  totalAccessToday: number;
  accessByMethod: { method: string; count: number }[];
  recentAccess: {
    id: number;
    timestamp: string;
    employeeName: string;
    employeeNumber: string;
    kiosk: string;
    method: string;
  }[];
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    "/dashboard",
    api
  );

  /* ‑ actualiza cuando llegue un nuevo acceso */
  useEffect(() => {
    const s = io("http://localhost:3000");
    s.on("access", () => mutate());
    return () => {
      s.close();
    };
  }, [mutate]);

  return { stats: data, error, isLoading };
}
