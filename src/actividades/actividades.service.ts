import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Actividad } from "./actividad.entity";
import { Estudiante } from "src/estudiantes/estudiante.entity";
import { CreateActividadDto } from "./dto/create-actividad.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async crearActividad(dto: CreateActividadDto): Promise<Actividad> {
    const { titulo } = dto;

    if (titulo.length < 15 || /[^\da-z ]/i.test(titulo)) {
      throw new BadRequestException(
        'Título inválido: mínimo 15 caracteres y solo letras, números y espacios'
      );
    }

    const actividad = this.actividadRepo.create({ ...dto, estado: 0 });
    return this.actividadRepo.save(actividad);
  }

  async cambiarEstado(actividadId: number, estado: number): Promise<Actividad> {
    const actividad = await this.actividadRepo.findOne({ where: { id: actividadId } });
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    const inscritos = await this.actividadRepo
      .createQueryBuilder('act')
      .relation(Actividad, 'estudiantes')
      .of(actividad)
      .loadMany<Estudiante>();
    const filled = inscritos.length;
    const capacity = actividad.cupoMaximo;

    if (estado === 1) {
      if (filled / capacity < 0.8) {
        throw new BadRequestException('No cumple 80% del cupo para cerrar');
      }
    } else if (estado === 2) {
      if (filled < capacity) {
        throw new BadRequestException('No está lleno para finalizar');
      }
    } else {
      throw new BadRequestException('Estado inválido');
    }

    actividad.estado = estado;
    return this.actividadRepo.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<Actividad[]> {
    const fechaObj = new Date(fecha);
    return this.actividadRepo.find({
      where: { fecha: fechaObj },
      relations: ['estudiantes']
    });
  }
}

