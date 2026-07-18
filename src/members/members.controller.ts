import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MembersService } from './members.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MembershipSubscriptionDto } from './dto/membership-subscription.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // Route 1: GET - Get Profile
  @Get('profile')
  getProfile() {
    return this.membersService.getProfile();
  }

  // Route 2: PUT - Update Profile
  // Lab Task 2 — Pipes: Category 1 rule — NID image must be no more than 2MB (handled via ParseFilePipe,
  // since file uploads arrive as multipart/form-data and cannot be validated with class-validator decorators)
  @Put('profile')
  @UseInterceptors(FileInterceptor('nidImage'))
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ],
      }),
    )
    nidImage?: Express.Multer.File,
  ) {
    return this.membersService.updateProfile('member_1', updateProfileDto, nidImage);
  }

  // Route 3: GET - Browse Membership Plans
  @Get('membership-plans')
  browseMembershipPlans() {
    return this.membersService.browseMembershipPlans();
  }

  // Route 4: POST - Subscribe to Plan
  @Post('membership/subscribe')
  subscribeToPlan(@Body() subscriptionDto: MembershipSubscriptionDto) {
    return this.membersService.subscribeToPlan('member_1', subscriptionDto.plan_id);
  }

  // Route 5: GET - Browse Classes with Filters
  @Get('classes')
  browseClasses(
    @Query('search') search?: string,
    @Query('trainerId') trainerId?: string,
    @Query('date') date?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.membersService.browseClasses({
      search,
      trainerId,
      date,
      page,
      limit,
    });
  }

  // Route 6: GET - Get Class Details
  @Get('classes/:id')
  getClassDetails(@Param('id') id: string) {
    return this.membersService.getClassDetails(id);
  }

  // Route 7: POST - Book a Class
  @Post('bookings')
  bookClass(@Body() bookingDto: CreateBookingDto) {
    return this.membersService.bookClass('member_1', bookingDto);
  }

  // Route 8: DELETE - Cancel Booking
  @Delete('bookings/:id')
  cancelBooking(@Param('id') id: string) {
    return this.membersService.cancelBooking('member_1', id);
  }

  // Additional routes for testing (optional)
  
  // GET - Get member bookings
  @Get('bookings')
  getMemberBookings() {
    return this.membersService.getMemberBookings('member_1');
  }

  // GET - Get payment history
  @Get('payments')
  getPaymentHistory() {
    return this.membersService.getPaymentHistory('member_1');
  }
}