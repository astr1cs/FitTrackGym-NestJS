import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TrainerModule } from './trainer/trainer.module';
import { MembersModule } from './members/members.module';
import { AdminUserEntity } from './admin/entities/admin-user.entity';
import { TrainerUserEntity } from './trainer/entities/trainer-user.entity';
import { TrainerEntity } from './trainer/entities/trainer.entity';
import { TrainerProfileEntity } from './trainer/entities/trainer-profile.entity';
import { ClassSessionEntity } from './trainer/entities/class-session.entity';
import { AttendanceEntity } from './trainer/entities/attendance.entity';
import { WorkoutPlanEntity } from './trainer/entities/workout-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'fittrack_db',
      entities: [
        AdminUserEntity,
        TrainerUserEntity,
        TrainerEntity,
        TrainerProfileEntity,
        ClassSessionEntity,
        AttendanceEntity,
        WorkoutPlanEntity,
      ],
      synchronize: true,
    }),
    AdminModule,
    TrainerModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}