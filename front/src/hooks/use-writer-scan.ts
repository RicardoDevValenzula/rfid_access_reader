"use client";
import { useCallback, useRef, useState } from "react";

const WRITER_URL = "http://localhost:3030";

type ScanStatus = "idle" | "waiting" | "success" | "error";

export function useWriterScan() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [uid, setUid] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    stopPolling();
    setUid(null);
    setStatus("waiting");

    try {
      const res = await fetch(`${WRITER_URL}/scan/start`, { method: "POST" });
      if (!res.ok) throw new Error("writer no disponible");
    } catch {
      setStatus("error");
      return;
    }

    timer.current = setInterval(async () => {
      try {
        const res = await fetch(`${WRITER_URL}/scan/status`);
        const data = await res.json();
        if (data.state === "success") {
          setStatus("success");
          setUid(data.uid);
          stopPolling();
        }
      } catch {
        setStatus("error");
        stopPolling();
      }
    }, 1000);
  }, [stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setStatus("idle");
    setUid(null);
  }, [stopPolling]);

  return { status, uid, start, reset };
}
