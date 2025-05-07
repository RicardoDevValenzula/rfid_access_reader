"use client";

import { useState, useEffect } from "react";

type Employee = {
  id: number;
  name: string;
  photoUrl: string | null;
  number: number;
};

export default function KioskPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showTime, setShowTime] = useState<string | null>(null);

  // Polling cada 2 s
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        "http://localhost:3000/access/latest?kioskId=kiosk-1"
      );
      const json = await res.json();
      if (json.ok) {
        setEmployee(json.employee);
        setShowTime(new Date().toLocaleTimeString());
        // Oculta overlay después de 3 s
        setTimeout(() => setEmployee(null), 3000);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!employee) {
    return (
      <p className="text-3xl animate-pulse tracking-widest">
        Esperando tarjeta…
      </p>
    );
  }

  return (
    <div className="text-center space-y-3 animate-fade">
      <h2 className="text-4xl font-bold">{employee.name}</h2>
      <p>ID {employee.number}</p>
      <p className="text-xl">{showTime}</p>
    </div>
  );
}
