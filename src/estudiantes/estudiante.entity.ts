import { Actividad } from "src/actividades/actividad.entity";
import { Resena } from "src/resenas/resena.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false
  })
  cedula: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  correo: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  programa: string;

  @Column({
    type: 'int',
    nullable: false
  })
  semestre: number;

  @ManyToMany(() => Actividad, actividad => actividad.estudiantes)
  @JoinTable()
  actividades: Actividad[];

  @OneToMany(() => Resena, resena => resena.estudiante)
  resenas: Resena[];
}