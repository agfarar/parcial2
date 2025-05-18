import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { Estudiante } from './estudiante.entity';
import { Actividad } from '../actividades/actividad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estudiante, Actividad]),
  ],
  providers: [EstudiantesService],
  controllers: [EstudiantesController],
  exports: [EstudiantesService],
})
export class EstudiantesModule {}
