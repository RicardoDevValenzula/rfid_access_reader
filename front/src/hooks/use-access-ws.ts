/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-access-ws.ts
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";

export function useAccessWS(kioskid: string, onAccess: (log: any) => void) {
  useEffect(() => {
    const socket = io(API_URL, {
      path: "/socket.io",
      query: {kioskid},
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("WS connected ✨"));
    socket.on("access", (data)=>{
      if(data.kioskid === kioskid){
        onAccess(data)
      }
    });
    socket.on("disconnect", () => console.log("WS disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [kioskid,onAccess]);
}
