/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-access-ws.ts
"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export function useAccessWS(kioskid: string, onAccess: (log: any) => void) {
  useEffect(() => {
    const socket = io("http://192.168.1.141:3000", {
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
