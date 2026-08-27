"use client";
import { useEffect, useState } from "react";

type AgentStatus = "checking" | "connected" | "disconnected";

export function useAgentPing(url: string, intervalMs = 4000): AgentStatus {
  const [status, setStatus] = useState<AgentStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!cancelled) setStatus(res.ok ? "connected" : "disconnected");
      } catch {
        if (!cancelled) setStatus("disconnected");
      }
    }

    check();
    const id = setInterval(check, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url, intervalMs]);

  return status;
}
