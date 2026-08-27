export interface Employee {
  id: number;
  name: string;
  number: number;
  photoUrl: string | null;
  pension?: string | null;
  dependencia?: string | null;
  email?: string | null;
  telefono?: string | null;
  tipo?: string | null;
}

export interface AccessLog {
  id: number;
  timestamp: string; // ISO
  employeeName: string;
  employeeNumber: string;
  kiosk: string; // o kiosk si así lo llamas
  method: "RFID" | "FINGER" | "MANUAL";
}

export interface Replacement {
  id: number;
  createdAt: string;
  originalEmployee: Employee;
  replacementEmployee: Employee;
}

export interface AttendanceReportRow extends Employee {
  accessCount: number;
  lastAccessAt: string | null;
}
