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
import { MailerService } from '@nestjs-modules/mailer';
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
    private readonly mailerService: MailerService,
  ) {}

  // Register
  async register(dto: RegisterDto) {
    const existing = await this.adminUserRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // BCrypt — hash password
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

    // Mailer — send welcome email after successful registration
    try {
      await this.mailerService.sendMail({
        to: savedUser.email,
        subject: 'Welcome to FitTrack Admin',
        html: `
          <h2>Welcome to FitTrack!</h2>
          <p>Hi ${dto.fullName ?? 'Admin'},</p>
          <p>Your admin account has been successfully created.</p>
          <p><strong>Account ID:</strong> ${savedUser.id}</p>
          <p><strong>Email:</strong> ${savedUser.email}</p>
          <p>You can now log in and manage your gym.</p>
          <br/>
          <p>— FitTrack Team</p>
        `,
      });
    } catch (mailError) {
      // Don't fail registration if mail fails — just log it
      console.warn('Welcome email failed to send:', mailError.message);
    }

    return {
      message: 'Admin registered successfully',
      id: savedUser.id,
      email: savedUser.email,
    };
  }

  // Login
  async login(dto: LoginDto) {
    const user = await this.adminUserRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // BCrypt — compare password with stored hash
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