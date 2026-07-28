import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrainerEntity } from './trainer.entity';

@Entity('trainer_profiles')
export class TrainerProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 150, default: 'General Fitness' })
  specialization: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  certification: string;

  @Column({ type: 'integer', default: 1 })
  experienceYears: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 40.0 })
  hourlyRate: number;

  @OneToOne(() => TrainerEntity, (trainer) => trainer.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  trainer: TrainerEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
