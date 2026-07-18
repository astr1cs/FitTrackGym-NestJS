import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('admin_users')
export class AdminUserEntity {

  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  // Category 2 — custom ID generated via @BeforeInsert hook
  // Generates an ID in the format ADM-000001 before every insert
  @BeforeInsert()
  generateId() {
    const timestamp = Date.now().toString().slice(-6);
    this.id = `ADM-${timestamp}`;
  }

  // Category 2 — boolean column, default true
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Category 2 — nullable varchar
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string | null;

  // Category 2 — bigint unsigned
  @Column({ type: 'bigint', unsigned: true })
  phone: number;
}