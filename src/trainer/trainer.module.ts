import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';

import { TrainerController } from './trainer.controller';
import { TrainerService } from './trainer.service';
import { TrainerMailService } from './trainer-mail.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { TrainerUserEntity } from './entities/trainer-user.entity';
import { TrainerEntity } from './entities/trainer.entity';
import { TrainerProfileEntity } from './entities/trainer-profile.entity';
import { ClassSessionEntity } from './entities/class-session.entity';
import { AttendanceEntity } from './entities/attendance.entity';
import { WorkoutPlanEntity } from './entities/workout-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainerUserEntity,
      TrainerEntity,
      TrainerProfileEntity,
      ClassSessionEntity,
      AttendanceEntity,
      WorkoutPlanEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fittrack_jwt_secret_key_2026',
      signOptions: { expiresIn: '1d' },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'trainer.fittrack@gmail.com',
          pass: process.env.SMTP_PASS || 'google_app_password_placeholder',
        },
      },
      defaults: {
        from: '"FitTrack Gym Trainer" <trainer.fittrack@gmail.com>',
      },
    }),
  ],
  controllers: [TrainerController],
  providers: [TrainerService, TrainerMailService, JwtStrategy],
  exports: [TrainerService, JwtStrategy, PassportModule],
})
export class TrainerModule {}
