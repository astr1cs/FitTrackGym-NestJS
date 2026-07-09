import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AdminUserEntity } from './entities/admin-user.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Trainer, Announcement } from './interfaces/trainer.interface';

// ─── existing mock data (Lab Task 1 & 2 — keep untouched) ───────────────────
const trainers: Trainer[] = [];
const announcements: Announcement[] = [];
let trainerIdCounter = 1;
let announcementIdCounter = 1;

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,
  ) {}

  // ─── existing methods (Lab Task 1 & 2 — unchanged) ───────────────────────

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
        { 
          type: 'new_member', 
          name: 'Sarah Johnson', 
          time: new Date().toISOString() 
        },
        { 
          type: 'payment', 
          amount: 89.99, 
          member: 'Mike Brown', 
          time: new Date().toISOString() 
        },
        { 
          type: 'class_full', 
          class: 'Yoga Flow', 
          time: new Date().toISOString() 
        },
      ],
    };
  }

  // Route 2: Create Trainer (POST)
  createTrainer(createTrainerDto: CreateTrainerDto, certificateFile?: Express.Multer.File) {
    const existingTrainer = trainers.find(t => t.email === createTrainerDto.email);
    if (existingTrainer) {
      throw new ConflictException('Trainer with this email already exists');
    }
    const newTrainer: Trainer = {
      id: `trainer_${trainerIdCounter++}`,
      name: createTrainerDto.name,
      email: createTrainerDto.email,
      password: createTrainerDto.password,
      phone: createTrainerDto.phone,
      specialty: createTrainerDto.specialty,
      bio: createTrainerDto.bio,
      experience_years: createTrainerDto.experience_years,
      certification: certificateFile?.originalname ?? createTrainerDto.certification,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      classesAssigned: 0,
    };
    trainers.push(newTrainer);
    const { password, ...trainerWithoutPassword } = newTrainer;
    return { message: 'Trainer created successfully', trainer: trainerWithoutPassword };
  }

  // Route 3: Get Trainers with Filters (GET)
  getTrainers(filters: { 
    specialty?: string; 
    isActive?: boolean; 
    page?: number; 
    limit?: number 
  }) {
    let filteredTrainers: Trainer[] = [...trainers];
    if (filters.specialty) {
      filteredTrainers = filteredTrainers.filter(
        t => t.specialty?.toLowerCase().includes(filters.specialty!.toLowerCase())
      );
    }
    if (filters.isActive !== undefined) {
      filteredTrainers = filteredTrainers.filter(t => t.is_active === filters.isActive);
    }
    const trainersWithoutPassword = filteredTrainers.map(({ password, ...rest }) => rest);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    return {
      data: trainersWithoutPassword.slice(startIndex, startIndex + limit),
      total: filteredTrainers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTrainers.length / limit),
    };
  }

  // Route 4: Get Trainer by ID (GET)
  getTrainerById(id: string) {
    const trainer = trainers.find(t => t.id === id);
    if (!trainer) throw new NotFoundException(`Trainer with ID ${id} not found`);
    const { password, ...trainerWithoutPassword } = trainer;
    return trainerWithoutPassword;
  }

  // Route 5: Update Trainer (PUT)
  updateTrainer(id: string, updateTrainerDto: UpdateTrainerDto) {
    const trainerIndex = trainers.findIndex(t => t.id === id);
    if (trainerIndex === -1) throw new NotFoundException(`Trainer with ID ${id} not found`);
    const updatedTrainer: Trainer = {
      ...trainers[trainerIndex],
      ...updateTrainerDto,
      updated_at: new Date().toISOString(),
    };
    trainers[trainerIndex] = updatedTrainer;
    const { password, ...trainerWithoutPassword } = updatedTrainer;
    return { message: 'Trainer updated successfully', trainer: trainerWithoutPassword };
  }

  // Route 6: Deactivate Trainer (PATCH)
  deactivateTrainer(id: string) {
    const trainerIndex = trainers.findIndex(t => t.id === id);
    if (trainerIndex === -1) throw new NotFoundException(`Trainer with ID ${id} not found`);
    trainers[trainerIndex].is_active = false;
    trainers[trainerIndex].updated_at = new Date().toISOString();
    const { password, ...trainerWithoutPassword } = trainers[trainerIndex];
    return { message: 'Trainer deactivated successfully', trainer: trainerWithoutPassword };
  }

  // Route 7: Delete Trainer (DELETE)
  deleteTrainer(id: string) {
    const trainerIndex = trainers.findIndex(t => t.id === id);
    if (trainerIndex === -1) throw new NotFoundException(`Trainer with ID ${id} not found`);
    trainers.splice(trainerIndex, 1);
    return { message: 'Trainer deleted successfully' };
  }

  // Route 8: Create Announcement (POST)
  createAnnouncement(announcementDto: CreateAnnouncementDto) {
    const newAnnouncement: Announcement = {
      id: `ann_${announcementIdCounter++}`,
      title: announcementDto.title,
      body: announcementDto.body,
      target_role: announcementDto.target_role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };
    announcements.push(newAnnouncement);
    return { message: 'Announcement created successfully', announcement: newAnnouncement };
  }

  // Additional helper methods for testing
  getAllTrainers() {
    return trainers.map(({ password, ...rest }) => rest);
  }

  getAllAnnouncements() {
    return announcements;
  }

  // ─── Lab Task 3 — TypeORM: Category 2 operations ─────────────────────────

  // Operation 1: Create a user
  async createAdminUser(dto: CreateAdminUserDto): Promise<AdminUserEntity> {
    const user = this.adminUserRepository.create({
      fullName: dto.fullName ?? null,
      phone: dto.phone,
      isActive: dto.isActive ?? true,
    });
    // @BeforeInsert on the entity will auto-call generateId() before save
    return await this.adminUserRepository.save(user);
  }

  // Operation 2: Modify the phone number of an existing user
  async updatePhone(id: string, dto: UpdatePhoneDto): Promise<AdminUserEntity> {
    const user = await this.adminUserRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    user.phone = dto.phone;
    return await this.adminUserRepository.save(user);
  }

  // Operation 3: Retrieve users with null values in the fullName column
  async getUsersWithNullFullName(): Promise<AdminUserEntity[]> {
    return await this.adminUserRepository.find({
      where: { fullName: IsNull() },
    });
  }

  // Operation 4: Remove a user from the system based on their id
  async removeAdminUser(id: string): Promise<{ message: string }> {
    const user = await this.adminUserRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.adminUserRepository.remove(user);
    return { message: `User ${id} removed successfully` };
  }
}