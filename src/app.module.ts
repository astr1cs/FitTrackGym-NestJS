import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AdminUserEntity } from './admin/entities/admin-user.entity';
import { AdminProfileEntity } from './admin/entities/admin-profile.entity';
import { TrainerEntity as AdminTrainerEntity } from './admin/entities/trainer.entity';

import { TrainerModule } from './trainer/trainer.module';
import { TrainerEntity } from './trainer/entities/trainer.entity';
import { TrainerProfileEntity } from './trainer/entities/trainer-profile.entity';
import { ClassSessionEntity } from './trainer/entities/class-session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: parseInt(config.get('DB_PORT') ?? '5432'),
        username: config.get('DB_USERNAME') || 'postgres',
        password: config.get('DB_PASSWORD') || 'admin',
        database: config.get('DB_NAME') || 'fittrack_db',
        entities: [
          AdminUserEntity,
          AdminProfileEntity,
          AdminTrainerEntity,
          TrainerEntity,
          TrainerProfileEntity,
          ClassSessionEntity,
        ],
        synchronize: true,
      }),
    }),
    AdminModule,
    TrainerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}