import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AdminUserEntity } from './admin-user.entity';

@Entity('admin_profiles')
export class AdminProfileEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // Category 2 — nullable varchar fullName
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string | null;

  // Category 2 — phone as varchar (bigint safe)
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  // ── Relationship 1: One to One → AdminUser (inverse side) ─────────────
  @OneToOne(() => AdminUserEntity, (adminUser) => adminUser.profile)
  @JoinColumn()
  adminUser: AdminUserEntity;
}