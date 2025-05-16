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
    <div className="flex h-screen flex-col items-center justify-center bg-white p-4 relative">
      <div className="absolute top-6 left-4 w-[100px] h-[100px]">
        <Image src={"/kiosk/left.webp"} width={100} height={100} alt={""} />
      </div>

      <div className="absolute top-6 right-4 w-[100px] h-[100px]">
        <Image src={"/kiosk/rigth.webp"} width={100} height={100} alt={""} />
      </div>

      {/* Contenido principal */}
      <div className="min-h-screen grid grid-rows-3 place-items-center place-content-between w-full max-w-4xl">
        {/* Aquí iría el logo principal - lo pondrás después */}
        <div className="h-[150px] flex items-center justify-center">
          <video
            src="/kiosk/video.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "auto" }}
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

        <div className="flex flex-row gap-10 items-center justify-center">
          <Image
            src={"/kiosk/bottom.webp"}
            width={500}
            height={6000}
            alt={""}
          />
          <Image src={"/kiosk/logo.webp"} width={100} height={100} alt={""} />
          <Image
            src={"/kiosk/bottom2.webp"}
            width={500}
            height={6000}
            alt={""}
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
