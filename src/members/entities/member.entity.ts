import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Booking } from './booking.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true }) // Adjust nullable depending on your migration requirements
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  nid?: string;

  // Added this missing property
  @Column({ nullable: true })
  nidImagePath?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  date_of_birth?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  fitness_goal?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  emergency_contact_name?: string;

  @Column({ nullable: true })
  emergency_contact_phone?: string;

  // Note: It must be plural -> 'subscriptions'
  @OneToMany(() => Subscription, (subscription) => subscription.member)
  subscriptions!: Subscription[];

  @OneToMany(() => Booking, (booking) => booking.member)
  bookings!: Booking[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}