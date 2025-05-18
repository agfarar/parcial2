import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateResenaDto {
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @IsNumber()
  @Min(0)
  calificacion: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsNotEmpty()
  estudianteId: number;

  @IsNumber()
  @IsNotEmpty()
  actividadId: number;
}
