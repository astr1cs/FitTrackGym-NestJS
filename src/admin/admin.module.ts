import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUserEntity } from './entities/admin-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUserEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}