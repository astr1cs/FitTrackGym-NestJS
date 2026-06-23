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
} from '@nestjs/common';
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
  @Put('profile')
  updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.membersService.updateProfile('member_1', updateProfileDto);
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