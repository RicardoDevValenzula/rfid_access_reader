/* hooks/use-access-logs.ts --------------------------------------- */
"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { AccessLog } from "./types";

interface LogResponse {
  data: {
    id: number;
    timestamp: string;
    kioskId: string;
    method: string;
    employee: { name: string; number: string };
  }[];
  total: number;
  page: number;
  take: number;
}

export function useAccessLogs(query: string) {
  const {
    data: resp,
    error,
    isLoading,
    mutate,
  } = useSWR<LogResponse>(`/access/logs?${query}`, api);

  // live update
  useEffect(() => {
    const socket = io("http://192.168.1.141:3000");
    socket.on("access", () => mutate());
    return () => {
      socket.close();
    };
  }, [mutate]);

  const logs: AccessLog[] =
    resp?.data.map((l) => ({
      id: l.id,
      timestamp: l.timestamp,
      kiosk: l.kioskId,
      method: l.method as AccessLog["method"],
      employeeName: l.employee.name,
      employeeNumber: l.employee.number,
    })) ?? [];

  return {
    logs,
    total: resp?.total ?? 0,
    page: resp?.page ?? 1,
    take: resp?.take ?? 20,
    isLoading,
    error,
  };
}
