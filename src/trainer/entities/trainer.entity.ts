import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { TrainerProfileEntity } from './trainer-profile.entity';
import { ClassSessionEntity } from './class-session.entity';

@Entity('trainer_accounts')
export class TrainerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 10, default: 'male' })
  gender: string;

  @Column({ type: 'integer', default: 28 })
  age: number;

  @Column({ type: 'varchar', default: 'active', length: 10 })
  status: string;

  @Column({ type: 'varchar', default: 'trainer' })
  role: string;

  @OneToOne(() => TrainerProfileEntity, (profile) => profile.trainer, {
    cascade: true,
    eager: true,
  })
  profile: TrainerProfileEntity;

  @OneToMany(() => ClassSessionEntity, (classSession) => classSession.trainer)
  classes: ClassSessionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
