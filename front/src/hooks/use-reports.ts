"use client";
import useSWR from "swr";
import { api } from "@/lib/api";
import { AttendanceReportRow, Employee, Replacement } from "./types";

export function useAttendanceReport() {
  const { data, error, isLoading } = useSWR<AttendanceReportRow[]>(
    "/reports/attendance",
    api
  );
  return { data: data ?? [], error, isLoading };
}

export function useReplacedReport() {
  const { data, error, isLoading } = useSWR<Replacement[]>(
    "/reports/replaced",
    api
  );
  return { data: data ?? [], error, isLoading };
}

export function useAbsentReport() {
  const { data, error, isLoading } = useSWR<Employee[]>(
    "/reports/absent",
    api
  );
  return { data: data ?? [], error, isLoading };
}
