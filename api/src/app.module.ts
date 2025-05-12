import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessModule } from './access/access.module';
import { EmployeesModule } from './employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [AccessModule, EmployeesModule, PrismaModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
