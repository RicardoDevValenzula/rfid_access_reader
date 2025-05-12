/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-access-ws.ts
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export function useAccessWS(onAccess: (log: any) => void) {
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      path: "/socket.io", // default
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("WS connected ✨"));
    socket.on("access", onAccess);
    socket.on("disconnect", () => console.log("WS disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [onAccess]);
}
