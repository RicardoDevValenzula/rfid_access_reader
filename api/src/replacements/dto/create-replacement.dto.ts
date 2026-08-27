import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReplacementDto {
  @IsString()
  @IsNotEmpty()
  originalEmployeeNumber: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  pension?: string;

  @IsOptional()
  @IsString()
  dependencia?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  kioskId?: string;
}
