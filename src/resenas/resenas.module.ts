import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena } from './resena.entity';
import { Estudiante } from '../estudiantes/estudiante.entity';
import { Actividad } from '../actividades/actividad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resena, Estudiante, Actividad]),
  ],
  providers: [ResenasService],
  controllers: [ResenasController],
  exports: [ResenasService],
})
export class ResenasModule {}
