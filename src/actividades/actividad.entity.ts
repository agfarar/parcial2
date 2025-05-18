import { Estudiante } from "src/estudiantes/estudiante.entity";
import { Resena } from "src/resenas/resena.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false
  })
  titulo: string;

  @Column({
    type: 'timestamp',
    nullable: false
  })
  fecha: Date;

  @Column({
    type: 'int',
    nullable: false
  })
  cupoMaximo: number;

  @Column({
    type: 'int',
    nullable: false
  })
  estado: number;

  @ManyToMany(() => Estudiante, estudiante => estudiante.actividades)
  estudiantes: Estudiante[];

  @OneToMany(() => Resena, resena => resena.actividad)
  resenas: Resena[];
}