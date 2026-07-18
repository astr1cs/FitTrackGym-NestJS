import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { AdminUserEntity } from './admin-user.entity';

@Entity('trainers')
export class TrainerEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  // Lab Task 2 — Pipes: Category 3 rule — phone starts with 01
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialty: string | null;

  // Lab Task 2 — Pipes: Category 3 rule — PDF certificate file
  @Column({ type: 'varchar', length: 255, nullable: true })
  certification: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // ── Relationship 2: Many to One → AdminUser ────────────────────────────
  @ManyToOne(() => AdminUserEntity, (adminUser) => adminUser.trainers)
  @JoinColumn()
  createdBy: AdminUserEntity;
}