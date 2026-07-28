import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { ClassSessionEntity } from './class-session.entity';

@Entity('attendances')
export class AttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  classId: string;

  @ManyToOne(() => ClassSessionEntity, (session) => session.attendances, {
    onDelete: 'CASCADE',
  })
  classSession: ClassSessionEntity;

  @Column({ type: 'varchar', length: 100 })
  memberId: string;

  @Column({ type: 'varchar', length: 100 })
  memberName: string;

  @Column({ type: 'varchar', length: 20, default: 'present' })
  status: string;

  @CreateDateColumn()
  recordedAt: Date;
}
