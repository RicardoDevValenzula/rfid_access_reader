import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessModule } from './access/access.module';

@Module({
  imports: [AccessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
