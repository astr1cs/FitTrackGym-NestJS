import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MembershipSubscriptionDto } from './dto/membership-subscription.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // POST - Create a new Member
  @Post()
  async createMember(@Body() dto: CreateMemberDto) {
    return await this.membersService.createMember(dto);
  }

  // POST - Create a new Gym Class
  @Post('classes')
  async createGymClass(@Body() dto: CreateGymClassDto) {
    return await this.membersService.createGymClass(dto);
  }

  // 1. GET - Get Profile
  @Get('profile')
  async getProfile(@Headers('test-member-id') memberId: string) {
    return await this.membersService.getProfile(memberId);
  }

  // 2. PUT - Update Profile
  @Put('profile')
  @UseInterceptors(FileInterceptor('nidImage'))
  async updateProfile(
    @Headers('test-member-id') memberId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
      }),
    )
    nidImage?: Express.Multer.File,
  ) {
    return await this.membersService.updateProfile(memberId, updateProfileDto, nidImage);
  }

  // 3. GET - Browse Membership Plans
  @Get('membership-plans')
  browseMembershipPlans() {
    return this.membersService.browseMembershipPlans();
  }

  // 4. POST - Subscribe to Plan
  @Post('membership/subscribe')
  async subscribeToPlan(
    @Headers('test-member-id') memberId: string,
    @Body() subscriptionDto: MembershipSubscriptionDto,
  ) {
    return await this.membersService.subscribeToPlan(memberId, subscriptionDto);
  }

  // 5. GET - Browse Classes
  @Get('classes')
  async browseClasses() {
    return await this.membersService.browseClasses();
  }

  // 6. POST - Book a Class
  @Post('bookings')
  async bookClass(
    @Headers('test-member-id') memberId: string,
    @Body() bookingDto: CreateBookingDto,
  ) {
    return await this.membersService.bookClass(memberId, bookingDto);
  }

  // 7. GET - Get Member Bookings
  @Get('bookings')
  async getMemberBookings(@Headers('test-member-id') memberId: string) {
    return await this.membersService.getMemberBookings(memberId);
  }

  // 8. DELETE - Cancel Booking
  @Delete('bookings/:id')
  async cancelBooking(
    @Headers('test-member-id') memberId: string,
    @Param('id') bookingId: string,
  ) {
    return await this.membersService.cancelBooking(memberId, bookingId);
  }
}