"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useAccessWS } from "@/hooks/use-access-ws";
import { speakName } from "@/lib/speech";
import { useSearchParams } from "next/navigation";

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

  useAccessWS(kioskId || "",(log) => {
    setEmployee(log.employee);
    speakName(log.employee.name);
    setTimeout(() => setEmployee(null), 3000);
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Bordes decorativos laterales */}
      <div className="absolute left-0 top-0 h-full w-[50px] sm:w-[70px]">
        <Image
          src={"/kiosk-update/Ambiente-sistema-Gráficos-laterales.png"}
          fill
          alt=""
          className="object-cover"
        />
      </div>
      <div className="absolute right-0 top-0 h-full w-[50px] sm:w-[70px] scale-x-[-1]">
        <Image
          src={"/kiosk-update/Ambiente-sistema-Gráficos-laterales.png"}
          fill
          alt=""
          className="object-cover"
        />
      </div>

      {/* Jaguar y Quetzalcóatl flotantes */}
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[120px] sm:w-[160px]">
        <Image
          src={"/kiosk-update/Ambiente-sistema-imagen-jaguar.png"}
          width={160}
          height={160}
          alt=""
          className="w-full h-auto"
        />
      </div>
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[120px] sm:w-[160px]">
        <Image
          src={"/kiosk-update/Ambiente-sistema-Quetzalcoatl.png"}
          width={160}
          height={160}
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Contenido principal */}
      <div className="min-h-screen grid grid-rows-3 place-items-center place-content-between w-full max-w-4xl">
        <div className="h-[150px] flex items-center justify-center">
          <Image
            src={"/kiosk-update/Ambiente-sistema-logo-CEO.png"}
            width={500}
            height={150}
            alt="Congreso Estatal Ordinario"
            className="h-full w-auto"
          />
        </div>

        <div className="text-center w-full mt-8">
          {!employee ? null : (
            <div className="animate-fade-in">
              <h1 className="text-[#8B1E3F] text-7xl font-bold mb-4">
                BIENVENIDO
              </h1>

              <h2 className="text-5xl font-bold text-[#F08C28]">
                {employee.name}
              </h2>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <Image
            src={"/kiosk-update/Ambiente-sistema-gráficos-pie.png"}
            width={700}
            height={150}
            alt=""
            className="w-full max-w-2xl h-auto"
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
