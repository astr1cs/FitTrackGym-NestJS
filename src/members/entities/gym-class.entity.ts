import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('gym_classes')
export class GymClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  trainer: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  booked: number;

  // INVERSE OF RELATIONSHIP 2: ONE-TO-MANY (A class can have many bookings)
  @OneToMany(() => Booking, (booking) => booking.gymClass)
  bookings: Booking[];
}