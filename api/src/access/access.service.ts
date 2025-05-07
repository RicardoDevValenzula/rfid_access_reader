import { Injectable } from '@nestjs/common';
import { PrismaClient, AccessMethod } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class AccessService {
  async cardRead(uid: string, kioskId: string) {
    const card = await prisma.card.findUnique({
      where: { uid },
      include: { employee: true },
    });
    if (!card) return null;

    await prisma.accessLog.create({
      data: {
        employeeId: card.employeeId,
        kioskId,
        method: AccessMethod.RFID,
      },
    });
    return card.employee;
  }

  async manual(number: number, kioskId: string) {
    const emp = await prisma.employee.findUnique({ where: { number } });
    if (!emp) return null;
    await prisma.accessLog.create({
      data: { employeeId: emp.id, kioskId, method: AccessMethod.MANUAL },
    });
    return emp;
  }

  async latest(kioskId: string) {
    return prisma.accessLog.findFirst({
      where: { kioskId },
      orderBy: { timestamp: 'desc' },
      include: { employee: true },
    });
  }
}
