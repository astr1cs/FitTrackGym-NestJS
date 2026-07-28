import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Subscription } from './entities/subscription.entity';
import { GymClass } from './entities/gym-class.entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Subscription, GymClass, Booking])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}