import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): {
        totalBookings: number;
        totalActiveMembers: number;
        totalActiveTrainers: number;
        totalPendingPayments: number;
        revenueToday: number;
        revenueThisMonth: number;
        upcomingClasses: number;
        recentActivities: ({
            type: string;
            name: string;
            time: string;
            amount?: undefined;
            member?: undefined;
            class?: undefined;
        } | {
            type: string;
            amount: number;
            member: string;
            time: string;
            name?: undefined;
            class?: undefined;
        } | {
            type: string;
            class: string;
            time: string;
            name?: undefined;
            amount?: undefined;
            member?: undefined;
        })[];
    };
}
