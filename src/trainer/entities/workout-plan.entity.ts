import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrainerEntity } from './trainer.entity';

@Entity('workout_plans')
export class WorkoutPlanEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  memberId: string;

  @Column({ type: 'varchar', length: 100 })
  memberName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  exercises: string;

  @Column({ type: 'varchar', length: 20, default: 'Intermediate' })
  difficultyLevel: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  trainerId: string;

  @ManyToOne(() => TrainerEntity, (trainer) => trainer.workoutPlans, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  trainer: TrainerEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
