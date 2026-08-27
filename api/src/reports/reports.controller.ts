import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Get('attendance')
  attendance() {
    return this.svc.attendance();
  }

  @Get('replaced')
  replaced() {
    return this.svc.replaced();
  }

  @Get('absent')
  absent() {
    return this.svc.absent();
  }
}
