import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Resena } from "./resena.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Estudiante } from "src/estudiantes/estudiante.entity";
import { Actividad } from "src/actividades/actividad.entity";
import { CreateResenaDto } from "./dto/create-resena.dto";

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena)
    private resenaRepo: Repository<Resena>,
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async agregarResena(dto: CreateResenaDto): Promise<Resena> {
    const { estudianteId, actividadId, comentario, calificacion, fecha } = dto;
    const estudiante = await this.estudianteRepo.findOne({ where: { id: estudianteId } });
    const actividad = await this.actividadRepo.findOne({ where: { id: actividadId }, relations: ['estudiantes'] });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    if (actividad.estado !== 2) {
      throw new BadRequestException('Actividad no finalizada');
    }
    if (!actividad.estudiantes.some(e => e.id === estudianteId)) {
      throw new BadRequestException('Estudiante no inscrito en la actividad');
    }
    const resena = this.resenaRepo.create({ comentario, calificacion, fecha, estudiante, actividad });
    return this.resenaRepo.save(resena);
  }

  async findClaseById(id: number): Promise<Resena> {
    const r = await this.resenaRepo.findOne({ where: { id }, relations: ['estudiante', 'actividad'] });
    if (!r) {
      throw new NotFoundException('Reseña no encontrada');
    }
    return r;
  }
}
