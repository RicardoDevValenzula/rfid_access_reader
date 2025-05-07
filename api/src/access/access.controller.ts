import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AccessService } from './access.service';

@Controller('access')
export class AccessController {
  constructor(private readonly svc: AccessService) {}

  @Post('card-read')
  async cardRead(@Body() dto: { uid: string; kioskId: string }) {
    const employee = await this.svc.cardRead(dto.uid, dto.kioskId);
    return employee
      ? { ok: true, employee }
      : { ok: false, message: 'Tarjeta no registrada' };
  }

  // NUEVO
  @Post('manual')
  async manual(@Body() dto: { employeeNumber: number; kioskId: string }) {
    const employee = await this.svc.manual(dto.employeeNumber, dto.kioskId);
    return employee ? { ok: true, employee } : { ok: false };
  }

  // usado por el kiosco para polling
  @Get('latest')
  async latest(@Query('kioskId') kioskId: string) {
    const log = await this.svc.latest(kioskId);
    return log ? { ok: true, employee: log.employee } : { ok: false };
  }
}
