import { Controller, Get, Post, Put, Delete, Body,Req, Param, Headers, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator,BadRequestException, Patch,HttpException,HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MembershipSubscriptionDto } from './dto/membership-subscription.dto';
import { UpdateClassDto } from './dto/update-class.dto'; // Update path if your folder structure is different
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // 1. Login Route 
  @Post('login')
  async login(@Body() body: { email: string; password: string }) 
  {
    if (!body.email || !body.password) 
    {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }
    return await this.membersService.login(body.email, body.password);
  }

  // 2.POST - Create a new Member
  @Post()
  async createMember(@Body() dto: CreateMemberDto) 
  {
    return await this.membersService.createMember(dto);
  }

  // 3.POST - Create a new Gym Class
  @Post('classes')
  async createGymClass(@Body() dto: CreateGymClassDto) 
  {
    return await this.membersService.createGymClass(dto);
  }

  // 4. GET - Get Profile
 @Get('profile')
  async getProfile(@Headers('test-member-id') memberId: string)
 {
    if (!memberId) 
    {
      throw new BadRequestException('Missing "test-member-id" header in Postman');
    }
    return this.membersService.getProfile(memberId);
  }


  // 5. Protected Update Profile Route (Extracts memberId from JWT token automatically)
  @Patch('profile')
  @UseGuards(JwtAuthGuard) // Blocks requests without a valid token
  @UseInterceptors(FileInterceptor('nidImage'))
  async updateProfile(
    @Req() req: any, // Grabs the user object attached by the JWT Strategy
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
      }),
    )
    nidImage?: Express.Multer.File,
  ) {
    // Extract the memberId securely from the token payload instead of a header!
    const memberId = req.user.userId; 

    return await this.membersService.updateProfile(memberId, updateProfileDto, nidImage);
  }


  // 6.PUT - Update Gym Class
  @Put('classes/:id')
  async updateClass(
    @Param('id') classId: string,
    @Body() updateClassDto: UpdateClassDto
  ) 
  {
    return await this.membersService.updateClass(classId, updateClassDto);
  }

  // 7. GET - Browse Membership Plans
  @Get('membership-plans')
  browseMembershipPlans() 
  {
    return this.membersService.browseMembershipPlans();
  }

  // 8. POST - Subscribe to Plan
  @Post('membership/subscribe')
  async subscribeToPlan(
    @Headers('test-member-id') memberId: string,
    @Body() subscriptionDto: MembershipSubscriptionDto,
  ) 
  {
    return await this.membersService.subscribeToPlan(memberId, subscriptionDto);
  }

  

  // 9. GET - Browse Classes
  @Get('classes')
  async browseClasses() 
  {
    return await this.membersService.browseClasses();
  }

  // 10. POST - Book a Class
  @Post('bookings')
  async bookClass(
    @Headers('test-member-id') memberId: string,
    @Body() bookingDto: CreateBookingDto,
  ) 
  {
    return await this.membersService.bookClass(memberId, bookingDto);
  }

  // 11. GET - Get Member Bookings
  @Get('bookings')
  async getMemberBookings(@Headers('test-member-id') memberId: string) 
  {
    return await this.membersService.getMemberBookings(memberId);
  }

  // 12. DELETE - Cancel Booking
  @Delete('bookings/:id')
  async cancelBooking(
    @Headers('test-member-id') memberId: string,
    @Param('id') bookingId: string,
  ) 
  {
    return await this.membersService.cancelBooking(memberId, bookingId);
  }

  
  // GET - Find subscription and member details by Subscription ID
  @Get('subscriptions/:id')
  async getSubscriptionById(@Param('id') subscriptionId: string)
 {
  return await this.membersService.getSubscriptionById(subscriptionId);
 }

}