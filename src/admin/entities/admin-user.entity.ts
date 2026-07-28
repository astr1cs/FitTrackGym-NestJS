import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { AdminProfileEntity } from './admin-profile.entity';
import { TrainerEntity } from './trainer.entity';

@Entity('admin_users')
export class AdminUserEntity {

  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  // Category 2 — custom ID via @BeforeInsert
  @BeforeInsert()
  generateId() {
    const timestamp = Date.now().toString().slice(-6);
    this.id = `ADM-${timestamp}`;
  }

  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string; // bcrypt hashed

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // ── Relationship 1: One to One → AdminProfile ──────────────────────────
  @OneToOne(() => AdminProfileEntity, (profile) => profile.adminUser, {
    cascade: true,
  })
  profile: AdminProfileEntity;

  // ── Relationship 2: One to Many → Trainer ─────────────────────────────
  @OneToMany(() => TrainerEntity, (trainer) => trainer.createdBy, {
    cascade: true,
  })
  trainers: TrainerEntity[];
}