import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';
import { Subscription } from './entities/subscription.entity';
import { GymClass } from './entities/gym-class.entity';
import { Booking } from './entities/booking.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, Subscription, GymClass, Booking]),
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SUPER_SECRET_KEY', // In production, this should be hidden in an environment variable (.env)
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [MembersController],
  providers: [MembersService, JwtStrategy],
})
export class MembersModule {}