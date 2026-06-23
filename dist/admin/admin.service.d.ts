import { CreateTrainerDto } from './dto/create-trainer.dto';
type Trainer = CreateTrainerDto & {
    id: string;
    is_active: boolean;
    created_at: string;
    classesAssigned: number;
};
export declare class AdminService {
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
    createTrainer(createTrainerDto: CreateTrainerDto): {
        message: string;
        trainer: Trainer;
    };
}
export {};
