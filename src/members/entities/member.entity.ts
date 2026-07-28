import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Booking } from './booking.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  nid: string;

  @Column({ nullable: true })
  nidImagePath: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  fitness_goal: string;

  // RELATIONSHIP 1: ONE-TO-ONE (A member has exactly 1 subscription)
  @OneToOne(() => Subscription, { cascade: true, eager: true })
  @JoinColumn()
  subscription: Subscription;

  // RELATIONSHIP 2: ONE-TO-MANY (A member can have many bookings)
  @OneToMany(() => Booking, (booking) => booking.member)
  bookings: Booking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}