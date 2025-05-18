import { Test, TestingModule } from '@nestjs/testing';
import { EstudiantesService } from './estudiantes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { Actividad } from '../actividades/actividad.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EstudiantesService', () => {
  let svc: EstudiantesService;
  let estudianteRepo: Repository<Estudiante>;
  let actividadRepo: Repository<Actividad>;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        EstudiantesService,
        { provide: getRepositoryToken(Estudiante), useClass: Repository },
        { provide: getRepositoryToken(Actividad), useClass: Repository },
      ],
    }).compile();

    svc = mod.get<EstudiantesService>(EstudiantesService);
    estudianteRepo = mod.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    actividadRepo = mod.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('crearEstudiante – caso positivo', async () => {
    const dto = { correo: 'a@b.com', semestre: 5 } as any;
    jest.spyOn(estudianteRepo, 'create').mockReturnValue(dto);
    jest.spyOn(estudianteRepo, 'save').mockResolvedValue(dto);
    await expect(svc.crearEstudiante(dto)).resolves.toEqual(dto);
  });

  it('crearEstudiante – semestre inválido', async () => {
    const dto = { correo: 'a@b.com', semestre: 12 } as any;
    await expect(svc.crearEstudiante(dto)).rejects.toThrow(BadRequestException);
    await expect(svc.crearEstudiante(dto)).rejects.toThrow('Semestre debe estar entre 1 y 10');
  });

  it('crearEstudiante – email inválido', async () => {
    const dto = { correo: 'invalid-email', semestre: 3 } as any;
    await expect(svc.crearEstudiante(dto)).rejects.toThrow(BadRequestException);
    await expect(svc.crearEstudiante(dto)).rejects.toThrow('Email inválido');
  });

  it('findEstudianteById – existe', async () => {
    const mockEst = { id: 1 } as Estudiante;
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(mockEst);
    await expect(svc.findEstudianteById(1)).resolves.toEqual(mockEst);
    expect(estudianteRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['actividades'] });
  });

  it('findEstudianteById – no existe', async () => {
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(null);
    await expect(svc.findEstudianteById(42)).rejects.toThrow(NotFoundException);
    await expect(svc.findEstudianteById(42)).rejects.toThrow('Estudiante no encontrado');
  });

  it('inscribirActividad – caso positivo', async () => {
    const est = { id: 1 } as Estudiante;
    const act = { id: 2, estado: 0, cupoMaximo: 2, estudiantes: [] } as any;
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(est);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(act);
    jest.spyOn(actividadRepo, 'save').mockResolvedValue({ ...act, estudiantes: [est] });

    const result = await svc.inscribirActividad(1, 2);
    expect(result.estudiantes).toContain(est);
  });

  it('inscribirActividad – actividad no encontrada', async () => {
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue({ id: 1 } as Estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(null);
    await expect(svc.inscribirActividad(1, 99)).rejects.toThrow(NotFoundException);
    await expect(svc.inscribirActividad(1, 99)).rejects.toThrow('Actividad no encontrada');
  });

  it('inscribirActividad – actividad cerrada', async () => {
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue({ id: 1 } as Estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue({ id: 2, estado: 1, estudiantes: [], cupoMaximo: 5 } as any);
    await expect(svc.inscribirActividad(1, 2)).rejects.toThrow(BadRequestException);
    await expect(svc.inscribirActividad(1, 2)).rejects.toThrow('Actividad no está abierta');
  });

  it('inscribirActividad – sin cupo', async () => {
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue({ id: 1 } as Estudiante);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue({ id: 2, estado: 0, estudiantes: [{ id: 1 }, { id: 2 }, { id: 3 }] as any, cupoMaximo: 3 } as any);
    await expect(svc.inscribirActividad(4, 2)).rejects.toThrow(BadRequestException);
    await expect(svc.inscribirActividad(4, 2)).rejects.toThrow('No hay cupo disponible');
  });

  it('inscribirActividad – inscripción previa', async () => {
    const est = { id: 1 } as Estudiante;
    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(est);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue({ id: 2, estado: 0, estudiantes: [est], cupoMaximo: 5 } as any);
    await expect(svc.inscribirActividad(1, 2)).rejects.toThrow(BadRequestException);
    await expect(svc.inscribirActividad(1, 2)).rejects.toThrow('Estudiante ya inscrito en esta actividad');
  });
});
