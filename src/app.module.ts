import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TrainerModule } from './trainer/trainer.module';
import { MembersModule } from './members/members.module';
import { AdminUserEntity } from './admin/entities/admin-user.entity';
import { AdminProfileEntity } from './admin/entities/admin-profile.entity';
import { TrainerEntity } from './admin/entities/trainer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'fittrack_db',
      entities: [AdminUserEntity, AdminProfileEntity, TrainerEntity],
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