import { Test, TestingModule } from '@nestjs/testing';
import { ResenasService } from './resenas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resena } from './resena.entity';
import { Estudiante } from '../estudiantes/estudiante.entity';
import { Actividad } from '../actividades/actividad.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ResenasService', () => {
  let svc: ResenasService;
  let resenaRepo: Repository<Resena>;
  let estudianteRepo: Repository<Estudiante>;
  let actividadRepo: Repository<Actividad>;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        ResenasService,
        { provide: getRepositoryToken(Resena), useClass: Repository },
        { provide: getRepositoryToken(Estudiante), useClass: Repository },
        { provide: getRepositoryToken(Actividad), useClass: Repository },
      ],
    }).compile();

    svc = mod.get<ResenasService>(ResenasService);
    resenaRepo = mod.get<Repository<Resena>>(getRepositoryToken(Resena));
    estudianteRepo = mod.get<Repository<Estudiante>>(getRepositoryToken(Estudiante));
    actividadRepo = mod.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('agregarResena – positivo', async () => {
    const dto = {
      estudianteId: 1,
      actividadId: 2,
      comentario: 'Excelente!',
      calificacion: 5,
      fecha: new Date().toISOString(),
    } as any;

    const mockEst = { id: 1 } as Estudiante;
    const mockAct = {
      id: 2,
      estado: 2,
      estudiantes: [{ id: 1 } as Estudiante],
    } as Actividad;
    const mockRes = { ...dto, id: 99, estudiante: mockEst, actividad: mockAct } as Resena;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(mockEst);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(mockAct);
    jest.spyOn(resenaRepo, 'create').mockReturnValue(mockRes);
    jest.spyOn(resenaRepo, 'save').mockResolvedValue(mockRes);

    await expect(svc.agregarResena(dto)).resolves.toEqual(mockRes);

    expect(estudianteRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(actividadRepo.findOne).toHaveBeenCalledWith({
      where: { id: 2 },
      relations: ['estudiantes'],
    });
    expect(resenaRepo.create).toHaveBeenCalledWith({
      comentario: dto.comentario,
      calificacion: dto.calificacion,
      fecha: dto.fecha,
      estudiante: mockEst,
      actividad: mockAct,
    });
  });

  it('agregarResena – actividad no finalizada', async () => {
    const dto = {
      estudianteId: 1,
      actividadId: 2,
      comentario: 'Ok',
      calificacion: 3,
      fecha: new Date().toISOString(),
    } as any;

    const mockEst = { id: 1 } as Estudiante;
    const mockAct = {
      id: 2,
      estado: 1, 
      estudiantes: [{ id: 1 } as Estudiante],
    } as Actividad;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(mockEst);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(mockAct);

    await expect(svc.agregarResena(dto)).rejects.toThrow(BadRequestException);
    await expect(svc.agregarResena(dto)).rejects.toThrow('Actividad no finalizada');

    expect(estudianteRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(actividadRepo.findOne).toHaveBeenCalledWith({
      where: { id: 2 },
      relations: ['estudiantes'],
    });
  });

  it('agregarResena – estudiante no inscrito', async () => {
    const dto = {
      estudianteId: 1,
      actividadId: 2,
      comentario: 'Ok',
      calificacion: 3,
      fecha: new Date().toISOString(),
    } as any;

    const mockEst = { id: 1 } as Estudiante;
    const mockAct = {
      id: 2,
      estado: 2,
      estudiantes: [],
    } as unknown as Actividad;

    jest.spyOn(estudianteRepo, 'findOne').mockResolvedValue(mockEst);
    jest.spyOn(actividadRepo, 'findOne').mockResolvedValue(mockAct);

    await expect(svc.agregarResena(dto)).rejects.toThrow(BadRequestException);
    await expect(svc.agregarResena(dto)).rejects.toThrow('Estudiante no inscrito en la actividad');
  });

  it('findClaseById – reseña existente', async () => {
    const mockRes = { id: 42, comentario: 'Genial', estudiante: {}, actividad: {} } as Resena;
    jest.spyOn(resenaRepo, 'findOne').mockResolvedValue(mockRes);

    await expect(svc.findClaseById(42)).resolves.toEqual(mockRes);
    expect(resenaRepo.findOne).toHaveBeenCalledWith({
      where: { id: 42 },
      relations: ['estudiante', 'actividad'],
    });
  });

  it('findClaseById – no encontrada', async () => {
    jest.spyOn(resenaRepo, 'findOne').mockResolvedValue(null);

    await expect(svc.findClaseById(99)).rejects.toThrow(NotFoundException);
    await expect(svc.findClaseById(99)).rejects.toThrow('Reseña no encontrada');
  });
});
