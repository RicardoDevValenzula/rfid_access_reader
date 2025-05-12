/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import useSWR from "swr";
import { Employee } from "./types";
import { api } from "@/lib/api";

export function useEmployees() {
  const { data, error, isLoading, mutate } = useSWR<Employee[]>(
    "/employees",
    api
  );

  const create = async (payload: any) => {
    console.log(payload)
    await api("/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    mutate();
  };

  const update = async (id: number, payload: any) => {
    await api(`/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    mutate();
  };

  const remove = async (id: number) => {
    await api(`/employees/${id}`, { method: "DELETE" });
    mutate();
  };

  const uploadPhoto = async (id: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    await api(`/employees/${id}/photo`, { method: "POST", body: fd });
    mutate();
  };

  return { data, error, isLoading, create, update, remove, uploadPhoto };
}
