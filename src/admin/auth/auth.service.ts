import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from '../entities/admin-user.entity';
import { AdminProfileEntity } from '../entities/admin-profile.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminUserRepository: Repository<AdminUserEntity>,

    @InjectRepository(AdminProfileEntity)
    private readonly adminProfileRepository: Repository<AdminProfileEntity>,

    private readonly jwtService: JwtService,
  ) {}

  // Register — bcrypt password + create admin user + create empty profile
  async register(dto: RegisterDto) {
    // Check if email already exists
    const existing = await this.adminUserRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // BCrypt — hash password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create admin user
    const user = this.adminUserRepository.create({
      email: dto.email,
      password: hashedPassword,
      isActive: true,
    });
    const savedUser = await this.adminUserRepository.save(user);

    // Create linked profile (One to One)
    const profile = this.adminProfileRepository.create({
      fullName: dto.fullName ?? null,
      phone: dto.phone ?? null,
      country: dto.country ?? null,
      adminUser: savedUser,
    });
    await this.adminProfileRepository.save(profile);

    return {
      message: 'Admin registered successfully',
      id: savedUser.id,
      email: savedUser.email,
    };
  }

  // Login — verify password + return JWT
  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.adminUserRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // BCrypt — compare incoming password with stored hash
    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new HttpException(
        'Account is deactivated',
        HttpStatus.FORBIDDEN,
      );
    }

    // Sign JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: 'admin',
    };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      id: user.id,
      email: user.email,
    };
  }
}