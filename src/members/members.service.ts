import { Injectable, NotFoundException, ConflictException,HttpException,HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MembershipSubscriptionDto } from './dto/membership-subscription.dto';
import { Member } from './entities/member.entity';
import { Subscription } from './entities/subscription.entity';
import { GymClass } from './entities/gym-class.entity';
import { Booking } from './entities/booking.entity';
import { UpdateClassDto } from './entities/update-class.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class MembersService 
{
  constructor(
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
    @InjectRepository(GymClass) private readonly classRepo: Repository<GymClass>,
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
    private readonly jwtService: JwtService,
  ) {}

 // Enhanced Login with BCrypt verification and HttpException
  async login(email: string, pass: string) 
  {
    const member = await this.memberRepo.findOne({ where: { email } });
    
    if (!member) 
    {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    // Compare the raw password with the secure hash stored in the database
    const isPasswordValid = await bcrypt.compare(pass, member.password);
    
    if (!isPasswordValid) 
    {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: member.id, email: member.email };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  
  }

  // CREATE Member
  async createMember(dto: CreateMemberDto) {
  console.log('--------------------------------------------------');
  console.log('1. Raw password received from Postman:', dto.password);

  const existing = await this.memberRepo.findOne({ where: { email: dto.email } });
  if (existing) {
    throw new HttpException('Email already exists', HttpStatus.CONFLICT);
  }

  // Ensure 'await' is present so it finishes hashing before moving on!
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
  console.log('2. Successfully generated BCrypt hash:', hashedPassword);

  // Manually map fields to completely block any plain-text leaking
  const newMember = this.memberRepo.create({
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    password: hashedPassword, // Explicitly passing the hash here
  });

  const savedMember = await this.memberRepo.save(newMember);
  console.log('3. Password saved in database record:', savedMember.password);
  console.log('--------------------------------------------------');

  return {
    message: 'Member created successfully with hashed password',
    member: {
      id: savedMember.id,
      name: savedMember.name,
      email: savedMember.email,
    },
  };
}

  // CREATE Gym Class
  async createGymClass(dto: CreateGymClassDto) 
  {
    const gymClass = this.classRepo.create({
      ...dto,
      booked: 0, // Starts with 0 bookings
    });
    return await this.classRepo.save(gymClass);
  }

  // Route 1: GET Profile (Fixed with TypeORM 0.3 Object Relations)
  async getProfile(memberId: string) 
  {
    const member = await this.memberRepo.findOne({
      where: { id: memberId },
      relations: {
        subscriptions: true,
        bookings: {
          gymClass: true,
        },
      },
    });
    
    if (!member) 
    {
      throw new HttpException('Member not found in the system', HttpStatus.NOT_FOUND);
    }
    return member;
  }

  // Route 2: PATCH Update Profile
  async updateProfile(memberId: string, dto: UpdateProfileDto, file?: Express.Multer.File) {
    const member = await this.getProfile(memberId);
    
    // If a password was passed in the update payload, hash it securely before saving!
    if ((dto as any).password) 
    {
      const saltRounds = 10;
      member.password = await bcrypt.hash((dto as any).password, saltRounds);
    }

    Object.assign(member, dto);
    
    if (file) {
      member.nidImagePath = file.originalname; 
    }

    const updatedMember = await this.memberRepo.save(member);
    return {
      message: 'Profile updated successfully',
      profile: updatedMember,
    };
  }

  // Route 2.1: PUT Update Class
  async updateClass(classId: string, dto: UpdateClassDto) 
  {
    // 1. Find the existing class in your database
    const gymClass = await this.classRepo.findOne({ where: { id: classId } });
    
    if (!gymClass) 
    {
      throw new HttpException('Gym class not found', HttpStatus.NOT_FOUND);
    }

    // 2. Overwrite EVERY property because it's a PUT request
    gymClass.name = dto.name;
    gymClass.trainer = dto.trainer;
    gymClass.date = dto.date;
    gymClass.time = dto.time;
    gymClass.capacity = dto.capacity;

    // 3. Save the replaced entity
    const updatedClass = await this.classRepo.save(gymClass);

    return {
      message: 'Class completely updated via PUT',
      gymClass: updatedClass
    };
  }

  // Route 3: GET Browse Membership Plans
  browseMembershipPlans()
   {
    const membershipPlans = [
      { id: 'plan_1', name: 'Basic', price: 49.99, duration: 30, features: ['Gym Access', 'Basic Classes'] },
      { id: 'plan_2', name: 'Premium', price: 89.99, duration: 30, features: ['Gym Access', 'All Classes', 'Personal Trainer'] },
      { id: 'plan_3', name: 'VIP', price: 149.99, duration: 30, features: ['Gym Access', 'All Classes', 'Personal Trainer', 'Nutrition Plan'] },
    ];
    return {
      data: membershipPlans,
      total: membershipPlans.length,
    };
  }

  // Route 4: POST Subscribe to Plan
  async subscribeToPlan(memberId: string, subscriptionDto: MembershipSubscriptionDto) 
  {
    const member = await this.getProfile(memberId);

    const membershipPlans = 
    [
      { id: 'plan_1', name: 'Basic', duration: 30 },
      { id: 'plan_2', name: 'Premium', duration: 30 },
      { id: 'plan_3', name: 'VIP', duration: 30 },
    ];

    const plan = membershipPlans.find(p => p.id === subscriptionDto.plan_id);
    if (!plan) 
    {
      throw new NotFoundException(`Plan with ID ${subscriptionDto.plan_id} not found`);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const newSubscription = this.subscriptionRepo.create({
      plan_id: plan.id,
      plan_name: plan.name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
    });

    await this.subscriptionRepo.save(newSubscription);

    member.subscriptions.push(newSubscription);
    await this.memberRepo.save(member);

    return {
      message: `Subscribed to ${plan.name} plan successfully`,
      subscription: newSubscription,
    };
  }

  // Route 5: GET Browse Classes
  async browseClasses() 
  {
    return await this.classRepo.find();
  }

  // Route 6: POST Book a Class
  async bookClass(memberId: string, bookingDto: CreateBookingDto) 
  {
    const member = await this.getProfile(memberId);
    
    const gymClass = await this.classRepo.findOne({ where: { id: bookingDto.class_id } });
    if (!gymClass) 
    {
      throw new NotFoundException('Class not found');
    }

    if (gymClass.booked >= gymClass.capacity) 
    {
      throw new ConflictException('Class is full.');
    }

    const existingBooking = await this.bookingRepo.findOne({
      where: { member: { id: memberId }, gymClass: { id: bookingDto.class_id }, status: 'booked' },
    });
    if (existingBooking) 
    {
      throw new ConflictException('Already booked for this class');
    }

    const booking = this.bookingRepo.create({
      member,
      gymClass,
      status: 'booked',
    });

    await this.bookingRepo.save(booking);

    gymClass.booked += 1;
    await this.classRepo.save(gymClass);

    return {
      message: 'Class booked successfully',
      booking: { id: booking.id, status: booking.status },
    };
  }

  // Route 7: GET Member Bookings (Fixed relations object syntax)
  async getMemberBookings(memberId: string) 
  {
    const memberBookings = await this.bookingRepo.find({
      where: { member: { id: memberId } },
      relations: 
      {
        gymClass: true,
      },
    });
    return {
      data: memberBookings,
      total: memberBookings.length,
    };
  }

  // Route 8: DELETE Cancel Booking (Fixed relations object syntax)
  async cancelBooking(memberId: string, bookingId: string) 
  {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: 
      {
        member: true,
        gymClass: true,
      },
    });

    if (!booking) 
    {
      throw new NotFoundException('Booking not found');
    }
    if (booking.member.id !== memberId) 
    {
      throw new ConflictException('This booking does not belong to you');
    }

    booking.status = 'cancelled';
    await this.bookingRepo.save(booking);

    if (booking.gymClass) 
    {
      booking.gymClass.booked -= 1;
      await this.classRepo.save(booking.gymClass);
    }

    return { message: 'Booking cancelled successfully' };
  }
}