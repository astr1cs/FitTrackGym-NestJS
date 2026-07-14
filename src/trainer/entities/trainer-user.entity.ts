import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trainer_users')
export class TrainerUserEntity {
  // Category 1 — primary key of type int that is unsigned
  @PrimaryGeneratedColumn({ type: 'integer', unsigned: true })
  id: number;

  // Category 1 — varchar column of maximum length 100 characters
  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  // Category 1 — age: unsigned integer
  @Column({ type: 'integer', unsigned: true })
  age: number;

  // Category 1 — status: default value 'active' and values are only 'active' or 'inactive'
  @Column({ type: 'varchar', default: 'active', length: 10 })
  status: string;
}
