/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
  number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * URL o path local del avatar.
   * Opcional al crear; se rellena al subir la foto.
   */
  @IsOptional()
  @IsString()
  photoUrl?: string | null;
}
