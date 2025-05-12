// api/src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('dashboard')
@UseGuards(AdminGuard) // usa x-admin-key
export class DashboardController {
  constructor(private svc: DashboardService) {}

  @Get()
  getStats() {
    return this.svc.getStats();
  }
}
