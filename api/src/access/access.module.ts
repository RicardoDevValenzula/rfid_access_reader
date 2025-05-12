import { Module } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { AccessGateway } from './access.gateway';

@Module({
  providers: [AccessService, AccessGateway],
  controllers: [AccessController],
})
export class AccessModule {}
