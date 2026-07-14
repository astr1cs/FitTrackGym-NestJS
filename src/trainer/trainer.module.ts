import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerController } from './trainer.controller';
import { TrainerService } from './trainer.service';
import { TrainerUserEntity } from './entities/trainer-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainerUserEntity]),
  ],
  controllers: [TrainerController],
  providers: [TrainerService],
})
export class TrainerModule {}
