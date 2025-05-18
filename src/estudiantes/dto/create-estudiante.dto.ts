import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateEstudianteDto {
  @IsNumber()
  @IsNotEmpty()
  cedula: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  programa: string;

  @IsNumber()
  @Min(1)
  semestre: number;
}