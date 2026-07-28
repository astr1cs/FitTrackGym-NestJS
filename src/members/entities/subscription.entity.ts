import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plan_id: string;

  @Column()
  plan_name: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ default: 'active' }) // 'active', 'expired', 'cancelled'
  status: string;

  @CreateDateColumn()
  created_at: Date;
}