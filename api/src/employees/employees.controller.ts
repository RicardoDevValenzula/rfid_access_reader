import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(AdminGuard)
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly svc: EmployeesService,
    private prisma: PrismaService,
  ) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    console.log(CreateEmployeeDto);
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Post('link-card')
  async linkCard(@Body() dto: { uid: string; employeeNumber: string }) {
    const emp = await this.prisma.employee.findUnique({
      where: { number: dto.employeeNumber },
    });
    if (!emp) throw new NotFoundException('Empleado no existe');

    /* 1. ¿Ya hay una tarjeta con ese UID? */
    const existing = await this.prisma.card.findUnique({
      where: { uid: dto.uid },
    });

    /* 2A. No existe → crear */
    if (!existing) {
      await this.prisma.card.create({
        data: { uid: dto.uid, employeeId: emp.id },
      });
      return { ok: true, action: 'CREATED' };
    }

    /* 2B. Existe y pertenece al mismo empleado → OK */
    if (existing.employeeId === emp.id) {
      return { ok: true, action: 'ALREADY_LINKED' };
    }

    /* 2C. Existe y pertenece a OTRO empleado → conflicto */
    throw new ConflictException(
      `Este UID ya está asignado al empleado #${existing.employeeId}`,
    );
  }
}
