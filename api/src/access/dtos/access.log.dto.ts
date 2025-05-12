/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class AccessLogQueryDto {
  @IsOptional() @IsString() search?: string; // nombre o número
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === 'all' ? undefined : value))
  kioskId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  take = 20;
}
