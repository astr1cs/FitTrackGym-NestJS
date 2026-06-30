import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Member, Booking, Payment } from './interfaces/member.interface';

// Mock Data Storage
let memberIdCounter = 1;
let bookingIdCounter = 1;
let paymentIdCounter = 1;

// Mock Member Data
const members: Member[] = [
  {
    id: 'member_1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1234567890',
    date_of_birth: '1990-01-15',
    gender: 'Female',
    fitness_goal: 'Weight Loss',
    membership: {
      plan: 'Premium',
      start_date: '2026-06-01',
      end_date: '2026-07-01',
      status: 'active',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Bookings
const bookings: Booking[] = [];

// Mock Payments
const payments: Payment[] = [
  {
    id: 'pay_1',
    member_id: 'member_1',
    amount: 89.99,
    description: 'Premium Membership - June 2026',
    payment_method: 'Credit Card',
    status: 'paid',
    paid_at: '2026-06-01T10:00:00Z',
    created_at: '2026-06-01T10:00:00Z',
  },
];

// Mock Membership Plans
const membershipPlans = [
  { 
    id: 'plan_1', 
    name: 'Basic', 
    price: 49.99, 
    duration: 30, 
    features: ['Gym Access', 'Basic Classes'] 
  },
  { 
    id: 'plan_2', 
    name: 'Premium', 
    price: 89.99, 
    duration: 30, 
    features: ['Gym Access', 'All Classes', 'Personal Trainer'] 
  },
  { 
    id: 'plan_3', 
    name: 'VIP', 
    price: 149.99, 
    duration: 30, 
    features: ['Gym Access', 'All Classes', 'Personal Trainer', 'Nutrition Plan'] 
  },
];

// Mock Classes
const gymClasses = [
  { 
    id: 'class_1', 
    name: 'Yoga Flow', 
    trainer: 'John Doe', 
    trainer_id: 'trainer_1',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '09:00', 
    capacity: 20, 
    booked: 12,
    description: 'Relaxing yoga flow for all levels'
  },
  { 
    id: 'class_2', 
    name: 'HIIT', 
    trainer: 'Jane Smith', 
    trainer_id: 'trainer_2',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    time: '10:30', 
    capacity: 15, 
    booked: 10,
    description: 'High Intensity Interval Training'
  },
  { 
    id: 'class_3', 
    name: 'Pilates', 
    trainer: 'Mike Johnson', 
    trainer_id: 'trainer_3',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days from now
    time: '14:00', 
    capacity: 12, 
    booked: 8,
    description: 'Core strengthening pilates'
  },
];

@Injectable()
export class MembersService {
  // Route 1: GET - Get Profile
  getProfile(memberId: string = 'member_1') {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }
    return member;
  }

  // Route 2: PUT - Update Profile
  updateProfile(memberId: string = 'member_1', updateProfileDto: UpdateProfileDto, nidImage?: Express.Multer.File) {
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    members[memberIndex] = {
      ...members[memberIndex],
      ...updateProfileDto,
      // Lab Task 2 — Pipes: NID image size/type validated by ParseFilePipe in the controller; we just store the filename here
      ...(nidImage ? { nidImagePath: nidImage.originalname } : {}),
      updated_at: new Date().toISOString(),
    };

    return {
      message: 'Profile updated successfully',
      profile: members[memberIndex],
    };
  }

  // Route 3: GET - Browse Membership Plans
  browseMembershipPlans() {
    return {
      data: membershipPlans,
      total: membershipPlans.length,
    };
  }

  // Route 4: POST - Subscribe to Plan
  subscribeToPlan(memberId: string = 'member_1', planId: string) {
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    const plan = membershipPlans.find(p => p.id === planId);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    members[memberIndex].membership = {
      plan: plan.name,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
    };

    // Create payment record
    const newPayment: Payment = {
      id: `pay_${paymentIdCounter++}`,
      member_id: memberId,
      amount: plan.price,
      description: `${plan.name} Membership - ${startDate.toISOString().split('T')[0]}`,
      payment_method: 'Credit Card', // Mock
      status: 'paid',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    payments.push(newPayment);

    return {
      message: `Subscribed to ${plan.name} plan successfully`,
      subscription: members[memberIndex].membership,
      payment: newPayment,
    };
  }

  // Route 5: GET - Browse Classes with Filters
  browseClasses(filters: { 
    search?: string; 
    trainerId?: string; 
    date?: string; 
    page?: number; 
    limit?: number 
  }) {
    let filteredClasses = [...gymClasses];

    // Search by name
    if (filters.search) {
      filteredClasses = filteredClasses.filter(
        c => c.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Filter by trainer
    if (filters.trainerId) {
      filteredClasses = filteredClasses.filter(
        c => c.trainer_id === filters.trainerId
      );
    }

    // Filter by date
    if (filters.date) {
      filteredClasses = filteredClasses.filter(c => c.date === filters.date);
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = filteredClasses.slice(startIndex, endIndex);
    
    // Add availability info
    const dataWithAvailability = paginatedData.map(c => ({
      ...c,
      available_spots: c.capacity - c.booked,
      is_full: c.booked >= c.capacity,
      is_upcoming: new Date(c.date) > new Date(),
    }));

    return {
      data: dataWithAvailability,
      total: filteredClasses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredClasses.length / limit),
    };
  }

  // Route 6: GET - Get Class Details
  getClassDetails(classId: string) {
    const classObj = gymClasses.find(c => c.id === classId);
    if (!classObj) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    // Get bookings for this class
    const classBookings = bookings.filter(b => b.class_id === classId);
    
    return {
      ...classObj,
      available_spots: classObj.capacity - classObj.booked,
      is_full: classObj.booked >= classObj.capacity,
      total_bookings: classBookings.length,
      bookings: classBookings.map(b => ({
        member_id: b.member_id,
        status: b.status,
        booked_at: b.created_at,
      })),
    };
  }

  // Route 7: POST - Book a Class
  bookClass(memberId: string = 'member_1', bookingDto: CreateBookingDto) {
    // Check if member exists
    const member = members.find(m => m.id === memberId);
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    // Check if membership is active
    if (member.membership.status !== 'active') {
      throw new ConflictException('Membership is not active. Please renew your membership.');
    }

    // Check if class exists
    const classObj = gymClasses.find(c => c.id === bookingDto.class_id);
    if (!classObj) {
      throw new NotFoundException(`Class with ID ${bookingDto.class_id} not found`);
    }

    // Check if class is full
    if (classObj.booked >= classObj.capacity) {
      throw new ConflictException('Class is full. Please join the waitlist.');
    }

    // Check if already booked
    const existingBooking = bookings.find(
      b => b.member_id === memberId && b.class_id === bookingDto.class_id && b.status !== 'cancelled'
    );
    if (existingBooking) {
      throw new ConflictException('Already booked for this class');
    }

    // Create booking
    const newBooking: Booking = {
      id: `booking_${bookingIdCounter++}`,
      member_id: memberId,
      class_id: bookingDto.class_id,
      class_name: classObj.name,
      trainer_name: classObj.trainer,
      date: classObj.date,
      time: classObj.time,
      status: 'booked',
      created_at: new Date().toISOString(),
    };
    bookings.push(newBooking);

    // Update class booked count
    classObj.booked += 1;

    return {
      message: 'Class booked successfully',
      booking: newBooking,
      class: {
        name: classObj.name,
        date: classObj.date,
        time: classObj.time,
        trainer: classObj.trainer,
        available_spots: classObj.capacity - classObj.booked,
      },
    };
  }

  // Route 8: DELETE - Cancel Booking
  cancelBooking(memberId: string = 'member_1', bookingId: string) {
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const booking = bookings[bookingIndex];
    
    // Check if booking belongs to member
    if (booking.member_id !== memberId) {
      throw new ConflictException('This booking does not belong to you');
    }

    // Check if booking can be cancelled (only future bookings)
    const bookingDate = new Date(booking.date);
    const today = new Date();
    if (bookingDate < today) {
      throw new ConflictException('Cannot cancel past bookings');
    }

    // Update booking status
    booking.status = 'cancelled';

    // Update class booked count
    const classObj = gymClasses.find(c => c.id === booking.class_id);
    if (classObj) {
      classObj.booked -= 1;
    }

    return {
      message: 'Booking cancelled successfully',
      booking: {
        id: booking.id,
        class_name: booking.class_name,
        date: booking.date,
        time: booking.time,
        status: booking.status,
      },
    };
  }

  // Additional helper methods for testing

  // Get all bookings for a member
  getMemberBookings(memberId: string = 'member_1') {
    const memberBookings = bookings.filter(b => b.member_id === memberId);
    return {
      data: memberBookings,
      total: memberBookings.length,
    };
  }

  // Get payment history for a member
  getPaymentHistory(memberId: string = 'member_1') {
    const memberPayments = payments.filter(p => p.member_id === memberId);
    return {
      data: memberPayments,
      total: memberPayments.length,
    };
  }

  // Get all members (admin helper)
  getAllMembers() {
    return members;
  }

  // Get all bookings (admin helper)
  getAllBookings() {
    return bookings;
  }

  // Get all payments (admin helper)
  getAllPayments() {
    return payments;
  }
}