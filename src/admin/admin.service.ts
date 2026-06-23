import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTrainerDto } from './dto/create-trainer.dto';

// Mock data storage
type Trainer = CreateTrainerDto & {
  id: string;
  is_active: boolean;
  created_at: string;
  classesAssigned: number;
};

const trainers: Trainer[] = [];
let trainerIdCounter = 1;

@Injectable()
export class AdminService {
  // Route 1: Dashboard Statistics (GET)
  getDashboardStats() {
    return {
      totalBookings: 156,
      totalActiveMembers: 342,
      totalActiveTrainers: trainers.filter(t => t.is_active).length,
      totalPendingPayments: 23,
      revenueToday: 1250,
      revenueThisMonth: 45230,
      upcomingClasses: 12,
      recentActivities: [
        { type: 'new_member', name: 'Sarah Johnson', time: '2026-06-22T10:30:00Z' },
        { type: 'payment', amount: 89.99, member: 'Mike Brown', time: '2026-06-22T09:15:00Z' },
        { type: 'class_full', class: 'Yoga Flow', time: '2026-06-22T08:45:00Z' },
      ],
    };
  }

  // Route 2: Create Trainer (POST)
  createTrainer(createTrainerDto: CreateTrainerDto) {
    const existingTrainer = trainers.find(t => t.email === createTrainerDto.email);

    if (existingTrainer) {
      throw new ConflictException('Trainer with this email already exists');
    }

    const newTrainer: Trainer = {
      id: `trainer_${trainerIdCounter++}`,
      ...createTrainerDto,
      is_active: true,
      created_at: new Date().toISOString(),
      classesAssigned: 0,
    };

    trainers.push(newTrainer);

    return {
      message: 'Trainer created successfully',
      trainer: newTrainer,
    };
  }
}