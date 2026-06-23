"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const trainers = [];
const announcements = [];
let trainerIdCounter = 1;
let announcementIdCounter = 1;
let AdminService = class AdminService {
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
                {
                    type: 'new_member',
                    name: 'Sarah Johnson',
                    time: new Date().toISOString()
                },
                {
                    type: 'payment',
                    amount: 89.99,
                    member: 'Mike Brown',
                    time: new Date().toISOString()
                },
                {
                    type: 'class_full',
                    class: 'Yoga Flow',
                    time: new Date().toISOString()
                },
            ],
        };
    }
    createTrainer(createTrainerDto) {
        const existingTrainer = trainers.find(t => t.email === createTrainerDto.email);
        if (existingTrainer) {
            throw new common_1.ConflictException('Trainer with this email already exists');
        }
        const newTrainer = {
            id: `trainer_${trainerIdCounter++}`,
            name: createTrainerDto.name,
            email: createTrainerDto.email,
            password: createTrainerDto.password,
            phone: createTrainerDto.phone,
            specialty: createTrainerDto.specialty,
            bio: createTrainerDto.bio,
            experience_years: createTrainerDto.experience_years,
            certification: createTrainerDto.certification,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            classesAssigned: 0,
        };
        trainers.push(newTrainer);
        const { password, ...trainerWithoutPassword } = newTrainer;
        return {
            message: 'Trainer created successfully',
            trainer: trainerWithoutPassword,
        };
    }
    getTrainers(filters) {
        let filteredTrainers = [...trainers];
        if (filters.specialty) {
            filteredTrainers = filteredTrainers.filter(t => t.specialty?.toLowerCase().includes(filters.specialty.toLowerCase()));
        }
        if (filters.isActive !== undefined) {
            filteredTrainers = filteredTrainers.filter(t => t.is_active === filters.isActive);
        }
        const trainersWithoutPassword = filteredTrainers.map(({ password, ...rest }) => rest);
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return {
            data: trainersWithoutPassword.slice(startIndex, endIndex),
            total: filteredTrainers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredTrainers.length / limit),
        };
    }
    getTrainerById(id) {
        const trainer = trainers.find(t => t.id === id);
        if (!trainer) {
            throw new common_1.NotFoundException(`Trainer with ID ${id} not found`);
        }
        const { password, ...trainerWithoutPassword } = trainer;
        return trainerWithoutPassword;
    }
    updateTrainer(id, updateTrainerDto) {
        const trainerIndex = trainers.findIndex(t => t.id === id);
        if (trainerIndex === -1) {
            throw new common_1.NotFoundException(`Trainer with ID ${id} not found`);
        }
        const updatedTrainer = {
            ...trainers[trainerIndex],
            ...updateTrainerDto,
            updated_at: new Date().toISOString(),
        };
        trainers[trainerIndex] = updatedTrainer;
        const { password, ...trainerWithoutPassword } = updatedTrainer;
        return {
            message: 'Trainer updated successfully',
            trainer: trainerWithoutPassword,
        };
    }
    deactivateTrainer(id) {
        const trainerIndex = trainers.findIndex(t => t.id === id);
        if (trainerIndex === -1) {
            throw new common_1.NotFoundException(`Trainer with ID ${id} not found`);
        }
        trainers[trainerIndex].is_active = false;
        trainers[trainerIndex].updated_at = new Date().toISOString();
        const { password, ...trainerWithoutPassword } = trainers[trainerIndex];
        return {
            message: 'Trainer deactivated successfully',
            trainer: trainerWithoutPassword,
        };
    }
    deleteTrainer(id) {
        const trainerIndex = trainers.findIndex(t => t.id === id);
        if (trainerIndex === -1) {
            throw new common_1.NotFoundException(`Trainer with ID ${id} not found`);
        }
        trainers.splice(trainerIndex, 1);
        return {
            message: 'Trainer deleted successfully',
        };
    }
    createAnnouncement(announcementDto) {
        const newAnnouncement = {
            id: `ann_${announcementIdCounter++}`,
            title: announcementDto.title,
            body: announcementDto.body,
            target_role: announcementDto.target_role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
        };
        announcements.push(newAnnouncement);
        return {
            message: 'Announcement created successfully',
            announcement: newAnnouncement,
        };
    }
    getAllTrainers() {
        return trainers.map(({ password, ...rest }) => rest);
    }
    getAllAnnouncements() {
        return announcements;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)()
], AdminService);
//# sourceMappingURL=admin.service.js.map