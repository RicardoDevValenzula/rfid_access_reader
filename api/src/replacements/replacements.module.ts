import { Module } from '@nestjs/common';
import { ReplacementsService } from './replacements.service';
import { ReplacementsController } from './replacements.controller';

@Module({
  providers: [ReplacementsService],
  controllers: [ReplacementsController],
})
export class ReplacementsModule {}
