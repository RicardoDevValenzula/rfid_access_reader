import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async attendance() {
    const employees = await this.prisma.employee.findMany({
      where: { accesses: { some: {} } },
      include: {
        _count: { select: { accesses: true } },
        accesses: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: { timestamp: true },
        },
      },
    });
    return employees.map(({ accesses, _count, ...e }) => ({
      ...e,
      accessCount: _count.accesses,
      lastAccessAt: accesses[0]?.timestamp ?? null,
    }));
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
