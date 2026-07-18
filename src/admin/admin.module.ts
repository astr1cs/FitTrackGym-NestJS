import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';

import { AdminUserEntity } from './entities/admin-user.entity';
import { AdminProfileEntity } from './entities/admin-profile.entity';
import { TrainerEntity } from './entities/trainer.entity';

@Module({
  imports: [
    // Register all 3 entities for this module
    TypeOrmModule.forFeature([
      AdminUserEntity,
      AdminProfileEntity,
      TrainerEntity,
    ]),

    // Passport with JWT as default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT config — secret must match jwt.strategy.ts
    JwtModule.register({
      secret: 'fittrack_jwt_secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AdminController,
    AuthController,
  ],
  providers: [
    AdminService,
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AdminModule {}