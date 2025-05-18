import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadDto } from './dto/create-actividad.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly svc: ActividadesService) {}

  @Post()
  crear(@Body() dto: CreateActividadDto) {
    return this.svc.crearActividad(dto);
  }

  @Patch(':id/estado/:estado')
  cambiarEstado(
    @Param('id') id: string,
    @Param('estado') estado: string
  ) {
    return this.svc.cambiarEstado(+id, +estado);
  }

  @Get()
  findByDate(@Query('fecha') fecha: string) {
    return this.svc.findAllActividadesByDate(fecha);
  }
}
