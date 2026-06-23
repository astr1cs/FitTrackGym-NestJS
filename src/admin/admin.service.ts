import { Injectable } from '@nestjs/common';

// Mock data storage
const trainers: { is_active: boolean }[] = [];

@Injectable()
export class AdminService {
  // Route 1: Dashboard Statistics (GET)
  getDashboardStats() {
    return {
      totalBookings: 156,
      totalActiveMembers: 342,
      totalActiveTrainers: trainers.filter(t => t.is_active).length,
      totalPendingPayments: 23,
      revenueToday: 1250,
      revenueThisMonth: 45230,
      upcomingClasses: 12,
      recentActivities: [
        { type: 'new_member', name: 'Sarah Johnson', time: '2026-06-22T10:30:00Z' },
        { type: 'payment', amount: 89.99, member: 'Mike Brown', time: '2026-06-22T09:15:00Z' },
        { type: 'class_full', class: 'Yoga Flow', time: '2026-06-22T08:45:00Z' },
      ],
    };
  }
}