import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { ActividadesModule } from './actividades/actividades.module';
import { ResenasModule } from './resenas/resenas.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [EstudiantesModule, ActividadesModule, ResenasModule, TypeOrmModule.forRootAsync({
    imports: [],
    inject: [],
    useFactory: () =>({
      type: 'postgres',
      //entities: [User],
      autoLoadEntities: true,
      synchronize: true,
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'angel',
      database: 'p2_database'
    })
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
