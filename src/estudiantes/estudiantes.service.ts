import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Estudiante } from "./estudiante.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Actividad } from "src/actividades/actividad.entity";
import { CreateEstudianteDto } from "./dto/create-estudiante.dto";

@Injectable()
export class EstudiantesService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async crearEstudiante(dto: CreateEstudianteDto): Promise<Estudiante> {
    const { correo, semestre } = dto;

    if (!correo.includes('@')) {
        throw new BadRequestException('Email inválido');
    }
    
    if (semestre < 1 || semestre > 10) {
      throw new BadRequestException('Semestre debe estar entre 1 y 10');
    }
    const estudiante = this.estudianteRepo.create(dto);
    return this.estudianteRepo.save(estudiante);
  }

  async findEstudianteById(id: number): Promise<Estudiante> {
    const est = await this.estudianteRepo.findOne({ where: { id }, relations: ['actividades'] });
    if (!est) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return est;
  }

  async inscribirActividad(estudianteId: number, actividadId: number): Promise<Actividad> {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad = await this.actividadRepo.findOne({ where: { id: actividadId }, relations: ['estudiantes'] });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    if (actividad.estado !== 0) {
      throw new BadRequestException('Actividad no está abierta');
    }
    if (actividad.estudiantes.some(e => e.id === estudianteId)) {
      throw new BadRequestException('Estudiante ya inscrito en esta actividad');
    }
    if (actividad.estudiantes.length >= actividad.cupoMaximo) {
      throw new BadRequestException('No hay cupo disponible');
    }
    actividad.estudiantes.push(estudiante);
    return this.actividadRepo.save(actividad);
  }
}