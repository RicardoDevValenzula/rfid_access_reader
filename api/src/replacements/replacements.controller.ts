import { Body, Controller, Post } from '@nestjs/common';
import { ReplacementsService } from './replacements.service';
import { CreateReplacementDto } from './dto/create-replacement.dto';

@Controller('replacements')
export class ReplacementsController {
  constructor(private readonly svc: ReplacementsService) {}

  @Post()
  create(@Body() dto: CreateReplacementDto) {
    return this.svc.create(dto);
  }
}
