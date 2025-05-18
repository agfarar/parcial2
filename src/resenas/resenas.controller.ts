import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';

@Controller('resenas')
export class ResenasController {
  constructor(private readonly svc: ResenasService) {}

  @Post()
  crear(@Body() dto: CreateResenaDto) {
    return this.svc.agregarResena(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.svc.findClaseById(+id);
  }
}
