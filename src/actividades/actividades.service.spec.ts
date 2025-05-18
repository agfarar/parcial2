import { Test, TestingModule } from '@nestjs/testing';
import { ActividadesService } from './actividades.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actividad } from './actividad.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ActividadesService', () => {
  let svc: ActividadesService;
  let repo: Repository<Actividad>;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadesService,
        { provide: getRepositoryToken(Actividad), useClass: Repository },
      ],
    }).compile();
    svc = mod.get<ActividadesService>(ActividadesService);
    repo = mod.get<Repository<Actividad>>(getRepositoryToken(Actividad));
  });

  it('crearActividad – caso positivo', async () => {
    const dto = {
      titulo: 'Actividad de larga duracion',
      fecha: new Date().toISOString(),
      cupoMaximo: 10,
      estado: 0,
    } as any;

    jest.spyOn(repo, 'create').mockReturnValue(dto);
    jest.spyOn(repo, 'save').mockResolvedValue(dto);

    await expect(svc.crearActividad(dto)).resolves.toEqual(dto);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, estado: 0 });
    expect(repo.save).toHaveBeenCalledWith(dto);
  });

  it('crearActividad – título con símbolo', async () => {
    const dto = {
      titulo: 'Inv@lido titulo',
      fecha: new Date().toISOString(),
      cupoMaximo: 5,
      estado: 0,
    } as any;

    await expect(svc.crearActividad(dto)).rejects.toThrow(BadRequestException);
    await expect(svc.crearActividad(dto)).rejects.toThrow(
      'Título inválido: mínimo 15 caracteres y solo letras, números y espacios'
    );
  });

  it('crearActividad – título muy corto', async () => {
    const dto = {
      titulo: 'Muy corto',
      fecha: new Date().toISOString(),
      cupoMaximo: 5,
      estado: 0,
    } as any;

    await expect(svc.crearActividad(dto)).rejects.toThrow(BadRequestException);
    await expect(svc.crearActividad(dto)).rejects.toThrow(
      'Título inválido: mínimo 15 caracteres y solo letras, números y espacios'
    );
  });
});

