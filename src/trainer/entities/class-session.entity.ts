import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrainerEntity } from './trainer.entity';

@Entity('class_sessions')
export class ClassSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column()
  trainerId: string;

  @ManyToOne(() => TrainerEntity, (trainer) => trainer.classes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  trainer: TrainerEntity;

  @Column({ type: 'varchar', length: 50 })
  startTime: string;

  @Column({ type: 'varchar', length: 50 })
  endTime: string;

  @Column({ type: 'varchar', length: 50, default: 'Studio A' })
  room: string;

  @Column({ type: 'integer', default: 15 })
  maxCapacity: number;

  @Column({ type: 'varchar', default: 'scheduled', length: 20 })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
