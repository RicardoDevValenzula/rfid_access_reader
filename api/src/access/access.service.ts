import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, AccessMethod, Prisma } from '@prisma/client';
import { AccessGateway } from './access.gateway';
import { AccessLogQueryDto } from './dtos/access.log.dto';
import { PrismaService } from 'src/prisma/prisma.service';
const prisma = new PrismaClient();

@Injectable()
export class AccessService {
  constructor(
    private gateway: AccessGateway,
    private prisma: PrismaService,
  ) {}

  async cardRead(uid: string, kioskId: string) {
    const card = await prisma.card.findUnique({
      where: { uid },
      include: { employee: true },
    });
    if (!card) return null;

    const log = await prisma.accessLog.create({
      data: {
        employeeId: card.employeeId,
        kioskId,
        method: AccessMethod.RFID,
      },
      include: { employee: true },
    });
    this.gateway.broadcastAccess(log);
    return log.employee;
  }

  async manual(number: string, kioskId: string) {
    const emp = await prisma.employee.findUnique({ where: { number } });
    if (!emp) throw new NotFoundException('Empleado no existe');

    const log = await prisma.accessLog.create({
      data: { employeeId: emp.id, kioskId, method: AccessMethod.MANUAL },
      include: { employee: true },
    });

    this.gateway.broadcastAccess(log);

    return log;
  }

  async getLogs(q: AccessLogQueryDto) {
    /* --- filtros comunes --------------------------------------- */
    const where: Prisma.AccessLogWhereInput = {
      ...(q.kioskId && { kioskId: q.kioskId }),
      ...(q.search && {
        OR: [
          {
            employee: {
              is: { name: { contains: q.search } },
            },
          },
          {
            employee: {
              is: { number: { contains: q.search } },
            },
          },
        ],
      }),
    };

    /* --- construir args paso a paso ---------------------------- */
    const args: Prisma.AccessLogFindManyArgs = {
      where,
      orderBy: { timestamp: 'desc' },
      include: { employee: true },
    };

    /** paginación opcional */
    if (q.take) {
      args.take = 10;
      args.skip = (q.page - 1) * q.take;
    }

    console.log(where);

    /** consulta + total */
    const [data, total] = await this.prisma.$transaction([
      this.prisma.accessLog.findMany(args),
      this.prisma.accessLog.count({ where }),
    ]);

    return { data, total, page: q.page, take: q.take ?? total };
  }

  async latest(kioskId: string) {
    return prisma.accessLog.findFirst({
      where: { kioskId },
      orderBy: { timestamp: 'desc' },
      include: { employee: true },
    });
  }
}
