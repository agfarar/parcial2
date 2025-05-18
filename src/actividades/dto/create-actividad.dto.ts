import { IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateActividadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @Min(0)
  cupoMaximo: number;

  @IsNumber()
  estado: number;
}