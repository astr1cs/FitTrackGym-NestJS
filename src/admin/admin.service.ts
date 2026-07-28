import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AdminUserEntity } from './entities/admin-user.entity';
import { AdminProfileEntity } from './entities/admin-profile.entity';
import { TrainerEntity } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  // Route 3: Get own profile (One to One — loads profile alongside user)
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

  // Route 4: Update own profile (One to One)
  async updateProfile(
    adminId: string,
    dto: UpdateProfileDto,
  ): Promise<AdminProfileEntity> {
    const profile = await this.adminProfileRepository.findOne({
      where: { adminUser: { id: adminId } },
      relations: { adminUser: true },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (dto.fullName !== undefined) profile.fullName = dto.fullName;
    if (dto.phone !== undefined) profile.phone = dto.phone;
    if (dto.country !== undefined) profile.country = dto.country;
    try {
      return await this.adminProfileRepository.save(profile);
    } catch (error) {
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Route 5: Create trainer (One to Many — linked to logged-in admin + BCrypt)
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

  // Route 6: Get all trainers (One to Many — shows createdBy admin)
  async getTrainers(): Promise<Partial<TrainerEntity>[]> {
    const trainers = await this.trainerRepository.find({
      relations: { createdBy: true },
    });
    return trainers.map(({ password, ...rest }) => rest);
  }

  // Route 7: Delete trainer
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
}