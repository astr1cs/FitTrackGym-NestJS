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
let trainerIdCounter = 1;
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
                { type: 'new_member', name: 'Sarah Johnson', time: '2026-06-22T10:30:00Z' },
                { type: 'payment', amount: 89.99, member: 'Mike Brown', time: '2026-06-22T09:15:00Z' },
                { type: 'class_full', class: 'Yoga Flow', time: '2026-06-22T08:45:00Z' },
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
            ...createTrainerDto,
            is_active: true,
            created_at: new Date().toISOString(),
            classesAssigned: 0,
        };
        trainers.push(newTrainer);
        return {
            message: 'Trainer created successfully',
            trainer: newTrainer,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)()
], AdminService);
//# sourceMappingURL=admin.service.js.map