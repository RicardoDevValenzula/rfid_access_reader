import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEmployeeDto) {
    console.log(CreateEmployeeDto);
    return this.prisma.employee.create({ data: dto });
  }

  findAll() {
    return this.prisma.employee.findMany({ orderBy: { number: 'asc' } });
  }

  async findOne(id: number) {
    const emp = await this.prisma.employee.findUnique({ where: { id } });
    if (!emp) throw new NotFoundException('Empleado no encontrado');
    return emp;
  }

  update(id: number, dto: UpdateEmployeeDto) {
    return this.prisma.employee.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.employee.delete({ where: { id } });
  }

  /** Se llama después de subir la foto */
  attachPhoto(id: number, filename: string) {
    const url = `/uploads/avatars/${filename}`;
    return this.prisma.employee.update({
      where: { id },
      data: { photoUrl: url },
    });
  }
}
