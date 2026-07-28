import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Member } from './member.entity';
import { GymClass } from './gym-class.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'booked' }) // 'booked', 'waitlisted', 'cancelled'
  status: string;

  // MANY-TO-ONE (Many bookings belong to 1 Member)
  @ManyToOne(() => Member, (member) => member.bookings)
  member: Member;

  // MANY-TO-ONE (Many bookings belong to 1 GymClass)
  @ManyToOne(() => GymClass, (gymClass) => gymClass.bookings)
  gymClass: GymClass;

  @CreateDateColumn()
  created_at: Date;
}