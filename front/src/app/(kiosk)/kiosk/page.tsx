"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useAccessWS } from "@/hooks/use-access-ws";
import { useAgentPing } from "@/hooks/use-agent-ping";
import { speakName } from "@/lib/speech";
import { useSearchParams } from "next/navigation";

const READER_STATUS_URL =
  process.env.NEXT_PUBLIC_READER_STATUS_URL ?? "http://localhost:3040/status";

type Employee = {
  id: number;
  name: string;
  photoUrl: string | null;
  number: number;
};

 function KioskClient() {
  const searchParams = useSearchParams();
  const kioskId = searchParams.get("kioskId");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const readerStatus = useAgentPing(READER_STATUS_URL);

  useAccessWS(kioskId || "",(log) => {
    setEmployee(log.employee);
    speakName(log.employee.name);
    setTimeout(() => setEmployee(null), 3000);
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      {/* Stage de relación de aspecto fija: todo adentro escala en proporción,
          sin importar la resolución del monitor del kiosco. */}
      <div
        className="relative bg-white overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          width: "min(100vw, 177.78vh)",
          containerType: "inline-size",
        }}
      >
        {/* Bordes decorativos laterales: el patrón se repite en vertical en
            vez de recortarse, porque la franja es más angosta que la imagen. */}
        <div
          className="absolute inset-y-0 left-[1.5%] w-[4.5%]"
          style={{
            backgroundImage:
              'url("/kiosk-update/Ambiente-sistema-Gráficos-laterales.png")',
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            backgroundPosition: "top center",
          }}
        />
        <div
          className="absolute inset-y-0 right-[1.5%] w-[4.5%] scale-x-[-1]"
          style={{
            backgroundImage:
              'url("/kiosk-update/Ambiente-sistema-Gráficos-laterales.png")',
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            backgroundPosition: "top center",
          }}
        />

        {/* Jaguar y Quetzalcóatl flotantes */}
        <div className="absolute left-[10%] top-1/2 w-[10%] -translate-y-1/2">
          <Image
            src={"/kiosk-update/Ambiente-sistema-imagen-jaguar.png"}
            width={300}
            height={300}
            alt=""
            className="w-full h-auto"
          />
        </div>
        <div className="absolute right-[10%] top-1/2 w-[10%] -translate-y-1/2">
          <Image
            src={"/kiosk-update/Ambiente-sistema-Quetzalcoatl.png"}
            width={300}
            height={300}
            alt=""
            className="w-full h-auto"
          />
        </div>

        {/* Contenido principal, centrado y repartido en el alto del stage */}
        <div className="flex h-full w-full flex-col items-center justify-between py-[4%]">
          <Image
            src={"/kiosk-update/Ambiente-sistema-logo-CEO.png"}
            width={600}
            height={180}
            alt="Congreso Estatal Ordinario"
            className="w-[32%] h-auto"
          />

          <div className="text-center px-[14%]">
            {readerStatus === "disconnected" ? (
              <div className="inline-block rounded-full bg-red-600 px-[2.5%] py-[0.8%] text-[1.6cqw] font-semibold text-white shadow-lg">
                Reader no detectado, por favor verificar conexión
              </div>
            ) : (
              employee && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <h1 className="text-[#8B1E3F] font-bold leading-tight text-[5.5cqw] mb-[1cqw]">
                    BIENVENIDO
                  </h1>
                  <h2 className="text-[#F08C28] font-bold leading-tight text-[3.8cqw]">
                    {employee.name}
                  </h2>
                </div>
              )
            )}
          </div>

          <Image
            src={"/kiosk-update/Ambiente-sistema-gráficos-pie.png"}
            width={900}
            height={200}
            alt=""
            className="w-[44%] h-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default function KioskPage(){
  return(
    <Suspense fallback={<div>Cargando Kiosko..</div>}>
      <KioskClient/>
    </Suspense>
  )
}
