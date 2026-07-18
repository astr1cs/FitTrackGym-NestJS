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

  // ─── Category 2: AdminUser operations ────────────────────────────────────

  async createAdminUser(dto: CreateAdminUserDto): Promise<AdminUserEntity> {
    const user = this.adminUserRepository.create({
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

  async updatePhone(adminId: string, dto: UpdatePhoneDto): Promise<AdminProfileEntity> {
    const profile = await this.adminProfileRepository.findOne({
      where: { adminUser: { id: adminId } },
      relations: { adminUser: true },
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

  async getUsersWithNullFullName(): Promise<AdminProfileEntity[]> {
    return await this.adminProfileRepository.find({
      where: { fullName: IsNull() },
      relations: { adminUser: true },
    });
  }

  async removeAdminUser(id: string): Promise<{ message: string }> {
    const user = await this.adminUserRepository.findOne({
      where: { id },
      relations: { profile: true },
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

  // ─── Profile (One to One) ─────────────────────────────────────────────────

  async getProfile(adminId: string): Promise<AdminUserEntity> {
    const user = await this.adminUserRepository.findOne({
      where: { id: adminId },
      relations: { profile: true },
    });
    if (!user) {
      throw new NotFoundException('Admin user not found');
    }
    return user;
  }

  async updateProfile(
    adminId: string,
    data: { fullName?: string; phone?: string; country?: string },
  ): Promise<AdminProfileEntity> {
    const profile = await this.adminProfileRepository.findOne({
      where: { adminUser: { id: adminId } },
      relations: { adminUser: true },
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

  // ─── Trainers (One to Many) ───────────────────────────────────────────────

  async createTrainer(
    adminId: string,
    dto: CreateTrainerDto,
    certificateFile?: Express.Multer.File,
  ): Promise<Partial<TrainerEntity>> {
    const admin = await this.adminUserRepository.findOne({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    const existing = await this.trainerRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Trainer with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const trainer = this.trainerRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      specialty: dto.specialty ?? null,
      isActive: true,
      certification: certificateFile?.originalname ?? dto.certification ?? null,
      createdBy: admin,
    });
    try {
      const saved = await this.trainerRepository.save(trainer);
      const { password, ...result } = saved;
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to create trainer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrainers(): Promise<Partial<TrainerEntity>[]> {
    const trainers = await this.trainerRepository.find({
      relations: { createdBy: true },
    });
    return trainers.map(({ password, ...rest }) => rest);
  }

  async getTrainerById(id: number): Promise<Partial<TrainerEntity>> {
    const trainer = await this.trainerRepository.findOne({
      where: { id },
      relations: { createdBy: true },
    });
    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }
    const { password, ...result } = trainer;
    return result;
  }

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

  async getTrainersByAdmin(adminId: string): Promise<Partial<TrainerEntity>[]> {
    const admin = await this.adminUserRepository.findOne({
      where: { id: adminId },
      relations: { trainers: true },
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    return admin.trainers.map(({ password, ...rest }) => rest);
  }

  // ─── Announcements ────────────────────────────────────────────────────────

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