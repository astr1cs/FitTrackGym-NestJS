import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TrainerController } from './trainer.controller';
import { TrainerService } from './trainer.service';
import { TrainerMailService } from './trainer-mail.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { TrainerEntity } from './entities/trainer.entity';
import { TrainerProfileEntity } from './entities/trainer-profile.entity';
import { ClassSessionEntity } from './entities/class-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainerEntity,
      TrainerProfileEntity,
      ClassSessionEntity,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'fittrack_jwt_secret',
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '1d' },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST') || 'smtp.gmail.com',
          port: parseInt(config.get('MAIL_PORT') ?? '587'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER') || 'merazuddin003@gmail.com',
            pass: config.get('MAIL_PASS') || 'pwux snsj lmle hdcy',
          },
        },
        defaults: {
          from: config.get('MAIL_FROM') || '"FitTrack Admin" <merazuddin003@gmail.com>',
        },
      }),
    }),
  ],
  controllers: [TrainerController],
  providers: [TrainerService, TrainerMailService, JwtStrategy],
  exports: [TrainerService, JwtStrategy, PassportModule],
})
export class TrainerModule {}
