import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AdminUserEntity } from './entities/admin-user.entity';
import { AdminProfileEntity } from './entities/admin-profile.entity';
import { TrainerEntity } from './entities/trainer.entity';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Announcement } from './interfaces/trainer.interface';

// ─── announcements still use mock array (no entity needed for lab) ───────────
const announcements: Announcement[] = [];
let announcementIdCounter = 1;

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,

    @InjectRepository(AdminProfileEntity)
    private readonly adminProfileRepository: Repository<AdminProfileEntity>,

    @InjectRepository(TrainerEntity)
    private readonly trainerRepository: Repository<TrainerEntity>,
  ) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  async getDashboardStats() {
    const totalAdmins = await this.adminUserRepository.count();
    const totalTrainers = await this.trainerRepository.count();
    const activeTrainers = await this.trainerRepository.count({
      where: { isActive: true },
    });

    return {
      totalAdmins,
      totalTrainers,
      activeTrainers,
      totalAnnouncements: announcements.length,
    };
  }

  // ─── Lab Task 3 — Category 2: AdminUser operations ───────────────────────

  // Operation 1: Create admin user (used internally, register handled in AuthService)
  async createAdminUser(dto: CreateAdminUserDto): Promise<AdminUserEntity> {
    const existing = await this.adminUserRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = this.adminUserRepository.create({
      fullName: dto.fullName ?? null,
      phone: dto.phone ?? null,
      isActive: dto.isActive ?? true,
    });

    try {
      return await this.adminUserRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'Failed to create admin user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Operation 2: Update phone via profile (One to One relationship)
  async updatePhone(adminId: string, dto: UpdatePhoneDto): Promise<AdminProfileEntity> {
    const profile = await this.adminProfileRepository.findOne({
      where: { adminUser: { id: adminId } },
      relations: ['adminUser'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile for admin ${adminId} not found`);
    }

    profile.phone = dto.phone;

    try {
      return await this.adminProfileRepository.save(profile);
    } catch (error) {
      throw new HttpException(
        'Failed to update phone',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Operation 3: Get users with null fullName in profile (One to One)
  async getUsersWithNullFullName(): Promise<AdminProfileEntity[]> {
    return await this.adminProfileRepository.find({
      where: { fullName: IsNull() },
      relations: ['adminUser'],
    });
  }

  // Operation 4: Remove admin user by id
  async removeAdminUser(id: string): Promise<{ message: string }> {
    const user = await this.adminUserRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`Admin user with ID ${id} not found`);
    }

    try {
      await this.adminUserRepository.remove(user);
      return { message: `Admin user ${id} removed successfully` };
    } catch (error) {
      throw new HttpException(
        'Failed to remove admin user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─── Profile routes (One to One relationship) ─────────────────────────────

  // Get own profile — loads AdminUser with linked AdminProfile
  async getProfile(adminId: string): Promise<AdminUserEntity> {
    const user = await this.adminUserRepository.findOne({
      where: { id: adminId },
      relations: ['profile'],  // One to One — loads profile alongside user
    });

    if (!user) {
      throw new NotFoundException('Admin user not found');
    }

    return user;
  }

  // Update own profile
  async updateProfile(
    adminId: string,
    data: { fullName?: string; phone?: string; country?: string },
  ): Promise<AdminProfileEntity> {
    const profile = await this.adminProfileRepository.findOne({
      where: { adminUser: { id: adminId } },
      relations: ['adminUser'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (data.fullName !== undefined) profile.fullName = data.fullName;
    if (data.phone !== undefined) profile.phone = data.phone;
    if (data.country !== undefined) profile.country = data.country;

    try {
      return await this.adminProfileRepository.save(profile);
    } catch (error) {
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ─── Trainer routes (One to Many relationship) ────────────────────────────

  // Create trainer — linked to admin (One to Many)
  async createTrainer(
    adminId: string,
    dto: CreateTrainerDto,
    certificateFile?: Express.Multer.File,
  ): Promise<TrainerEntity> {
    // Check admin exists
    const admin = await this.adminUserRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    // Check trainer email not taken
    const existing = await this.trainerRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Trainer with this email already exists');
    }

    // BCrypt — hash trainer password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const trainer = this.trainerRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      specialty: dto.specialty ?? null,
      isActive: true,
      certification: certificateFile?.originalname ?? dto.certification ?? null,
      createdBy: admin,  // One to Many — link trainer to admin
    });

    try {
      const saved = await this.trainerRepository.save(trainer);
      // Remove password from response
      const { password, ...result } = saved;
      return result as TrainerEntity;
    } catch (error) {
      throw new HttpException(
        'Failed to create trainer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all trainers — loads with their createdBy admin (One to Many)
  async getTrainers(): Promise<Partial<TrainerEntity>[]> {
    const trainers = await this.trainerRepository.find({
      relations: ['createdBy'],  // One to Many — shows which admin created each trainer
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialty: true,
        isActive: true,
        createdAt: true,
        createdBy: {
          id: true,
          email: true,
        },
      },
    });

    return trainers;
  }

  // Get single trainer by id
  async getTrainerById(id: number): Promise<Partial<TrainerEntity>> {
    const trainer = await this.trainerRepository.findOne({
      where: { id },
      relations: ['createdBy'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        specialty: true,
        isActive: true,
        createdAt: true,
        createdBy: {
          id: true,
          email: true,
        },
      },
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }

    return trainer;
  }

  // Update trainer
  async updateTrainer(
    id: number,
    dto: UpdateTrainerDto,
  ): Promise<Partial<TrainerEntity>> {
    const trainer = await this.trainerRepository.findOne({ where: { id } });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }

    if (dto.name) trainer.name = dto.name;
    if (dto.phone) trainer.phone = dto.phone;
    if (dto.specialty) trainer.specialty = dto.specialty;
    if (dto.isActive !== undefined) trainer.isActive = dto.isActive;

    // BCrypt — rehash if password is being updated
    if (dto.password) {
      trainer.password = await bcrypt.hash(dto.password, 10);
    }

    try {
      const saved = await this.trainerRepository.save(trainer);
      const { password, ...result } = saved;
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to update trainer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete trainer
  async deleteTrainer(id: number): Promise<{ message: string }> {
    const trainer = await this.trainerRepository.findOne({ where: { id } });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }

    try {
      await this.trainerRepository.remove(trainer);
      return { message: `Trainer ${id} deleted successfully` };
    } catch (error) {
      throw new HttpException(
        'Failed to delete trainer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all trainers created by a specific admin (One to Many)
  async getTrainersByAdmin(adminId: string): Promise<Partial<TrainerEntity>[]> {
    const admin = await this.adminUserRepository.findOne({
      where: { id: adminId },
      relations: ['trainers'],  // One to Many — loads all trainers under this admin
    });

    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }

    return admin.trainers.map(({ password, ...rest }) => rest);
  }

  // ─── Announcements (mock array — no entity needed) ────────────────────────

  createAnnouncement(dto: CreateAnnouncementDto) {
    const newAnnouncement: Announcement = {
      id: `ann_${announcementIdCounter++}`,
      title: dto.title,
      body: dto.body,
      target_role: dto.target_role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };
    announcements.push(newAnnouncement);
    return { message: 'Announcement created successfully', announcement: newAnnouncement };
  }

  getAllAnnouncements() {
    return announcements;
  }
}