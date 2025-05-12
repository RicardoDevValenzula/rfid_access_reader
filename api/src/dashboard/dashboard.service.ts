// api/src/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { AccessMethod } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const [totalEmployees, pendingEmployees] = await this.prisma.$transaction([
      this.prisma.employee.count(),
      this.prisma.employee.count({
        where: { cards: { none: {} } },
      }),
    ]);

    const accesosHoy = await this.prisma.accessLog.groupBy({
      by: ['method'],
      where: { timestamp: { gte: todayStart, lte: todayEnd } },
      _count: { _all: true },
    });
    const totalAccessToday = accesosHoy.reduce(
      (sum, m) => sum + m._count._all,
      0,
    );
    const accessByMethod = Object.values(AccessMethod).map((m) => ({
      method: m,
      count: accesosHoy.find((x) => x.method === m)?._count._all ?? 0,
    }));

    const recentAccess = await this.prisma.accessLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 4,
      include: { employee: true },
    });

    return {
      totalEmployees,
      pendingEmployees,
      totalAccessToday,
      accessByMethod,
      recentAccess: recentAccess.map((r) => ({
        id: r.id,
        timestamp: r.timestamp,
        kiosk: r.kioskId,
        method:
          r.method === 'RFID'
            ? 'Tarjeta'
            : r.method === 'MANUAL'
              ? 'Huella'
              : 'Manual',
        employeeName: r.employee.name,
        employeeNumber: r.employee.number,
      })),
    };
  }
}
