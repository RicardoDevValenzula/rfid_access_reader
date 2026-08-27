import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReplacementDto } from './dto/create-replacement.dto';

@Injectable()
export class ReplacementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReplacementDto) {
    const original = await this.prisma.employee.findUnique({
      where: { number: dto.originalEmployeeNumber },
    });
    if (!original) throw new NotFoundException('Empleado original no existe');

    let replacement: Awaited<
      ReturnType<typeof this.prisma.employee.findUnique>
    > = null;
    if (dto.number) {
      replacement = await this.prisma.employee.findUnique({
        where: { number: dto.number },
      });
    }
    if (!replacement && dto.email) {
      replacement = await this.prisma.employee.findFirst({
        where: { email: dto.email },
      });
    }

    if (!replacement) {
      if (!dto.number || !dto.name) {
        throw new BadRequestException(
          'Se requiere number y name para dar de alta al reemplazante',
        );
      }
      replacement = await this.prisma.employee.create({
        data: {
          number: dto.number,
          name: dto.name,
          email: dto.email,
          photoUrl: dto.photoUrl,
          pension: dto.pension,
          dependencia: dto.dependencia,
          telefono: dto.telefono,
          tipo: dto.tipo,
        },
      });
    }

    return this.prisma.replacement.create({
      data: {
        originalEmployeeId: original.id,
        replacementEmployeeId: replacement.id,
        kioskId: dto.kioskId,
      },
      include: {
        originalEmployee: true,
        replacementEmployee: true,
      },
    });
  }
}
