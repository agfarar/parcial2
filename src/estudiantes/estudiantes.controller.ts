import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly svc: EstudiantesService) {}

  @Post()
  crear(@Body() dto: CreateEstudianteDto) {
    return this.svc.crearEstudiante(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.svc.findEstudianteById(+id);
  }

  @Post(':id/inscribir/:actId')
  inscribir(
    @Param('id') id: string,
    @Param('actId') actId: string
  ) {
    return this.svc.inscribirActividad(+id, +actId);
  }
}
