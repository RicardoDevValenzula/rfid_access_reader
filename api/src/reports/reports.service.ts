import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async attendance() {
    const employees = await this.prisma.employee.findMany({
      where: { accesses: { some: {} } },
      include: {
        accesses: {
          orderBy: { timestamp: 'asc' },
          select: { timestamp: true },
        },
      },
    });

    // Una fila por cada día distinto en que el empleado tuvo al menos
    // un acceso, en vez de un conteo único acumulado.
    const rows: Array<
      Omit<(typeof employees)[number], 'accesses'> & {
        date: string;
        accessCount: number;
      }
    > = [];

    for (const { accesses, ...employee } of employees) {
      const byDay = new Map<string, number>();
      for (const { timestamp } of accesses) {
        const day = timestamp.toISOString().slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
      }
      for (const [date, accessCount] of byDay) {
        rows.push({ ...employee, date, accessCount });
      }
    }

    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }

  replaced() {
    return this.prisma.replacement.findMany({
      include: {
        originalEmployee: true,
        replacementEmployee: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  absent() {
    return this.prisma.employee.findMany({
      where: {
        accesses: { none: {} },
        replacedAs: { none: {} },
      },
    });
  }
}
