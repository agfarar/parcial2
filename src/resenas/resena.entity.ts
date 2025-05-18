import { Actividad } from "src/actividades/actividad.entity";
import { Estudiante } from "src/estudiantes/estudiante.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Resena {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false
  })
  comentario: string;

  @Column({
    type: 'int',
    nullable: false
  })
  calificacion: number;

  @Column({
    type: 'timestamp',
    nullable: false
  })
  fecha: Date;

  @ManyToOne(() => Estudiante, estudiante => estudiante.resenas)
  estudiante: Estudiante;

  @ManyToOne(() => Actividad, actividad => actividad.resenas)
  actividad: Actividad;
}