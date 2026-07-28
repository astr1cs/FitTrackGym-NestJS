import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,ManyToOne } from 'typeorm';
import { Member } from './member.entity';

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

  // Must match the relation setup expected by TypeORM
  @ManyToOne(() => Member, (member) => member.subscriptions, { onDelete: 'CASCADE' })
  member!: Member;
}