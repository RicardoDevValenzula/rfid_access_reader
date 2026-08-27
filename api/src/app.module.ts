import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessModule } from './access/access.module';
import { EmployeesModule } from './employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReplacementsModule } from './replacements/replacements.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    AccessModule,
    EmployeesModule,
    PrismaModule,
    DashboardModule,
    ReplacementsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
