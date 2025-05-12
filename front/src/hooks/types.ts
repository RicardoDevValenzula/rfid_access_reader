export interface Employee {
  id: number;
  name: string;
  number: number;
  photoUrl: string | null;
}

export interface AccessLog {
  id: number;
  timestamp: string; // ISO
  employeeName: string;
  employeeNumber: string;
  kiosk: string; // o kiosk si así lo llamas
  method: "RFID" | "FINGER" | "MANUAL";
}
