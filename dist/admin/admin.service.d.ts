import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Announcement } from './interfaces/trainer.interface';
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
        trainer: {
            id: string;
            name: string;
            email: string;
            phone: string;
            specialty?: string;
            bio?: string;
            experience_years?: number;
            certification?: string;
            is_active: boolean;
            created_at: string;
            updated_at: string;
            classesAssigned: number;
        };
    };
    getTrainers(filters: {
        specialty?: string;
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): {
        data: {
            id: string;
            name: string;
            email: string;
            phone: string;
            specialty?: string;
            bio?: string;
            experience_years?: number;
            certification?: string;
            is_active: boolean;
            created_at: string;
            updated_at: string;
            classesAssigned: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    getTrainerById(id: string): {
        id: string;
        name: string;
        email: string;
        phone: string;
        specialty?: string;
        bio?: string;
        experience_years?: number;
        certification?: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        classesAssigned: number;
    };
    updateTrainer(id: string, updateTrainerDto: UpdateTrainerDto): {
        message: string;
        trainer: {
            id: string;
            name: string;
            email: string;
            phone: string;
            specialty?: string;
            bio?: string;
            experience_years?: number;
            certification?: string;
            is_active: boolean;
            created_at: string;
            updated_at: string;
            classesAssigned: number;
        };
    };
    deactivateTrainer(id: string): {
        message: string;
        trainer: {
            id: string;
            name: string;
            email: string;
            phone: string;
            specialty?: string;
            bio?: string;
            experience_years?: number;
            certification?: string;
            is_active: boolean;
            created_at: string;
            updated_at: string;
            classesAssigned: number;
        };
    };
    deleteTrainer(id: string): {
        message: string;
    };
    createAnnouncement(announcementDto: CreateAnnouncementDto): {
        message: string;
        announcement: Announcement;
    };
    getAllTrainers(): {
        id: string;
        name: string;
        email: string;
        phone: string;
        specialty?: string;
        bio?: string;
        experience_years?: number;
        certification?: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        classesAssigned: number;
    }[];
    getAllAnnouncements(): Announcement[];
}
