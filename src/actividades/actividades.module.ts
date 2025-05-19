import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActividadesService } from './actividades.service';
import { ActividadesController } from './actividades.controller';
import { Actividad } from './actividad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Actividad]),
  ],
  providers: [ActividadesService],
  controllers: [ActividadesController],
  exports: [ActividadesService],
})
export class ActividadesModule {}

