"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const create_trainer_dto_1 = require("./dto/create-trainer.dto");
const update_trainer_dto_1 = require("./dto/update-trainer.dto");
const create_announcement_dto_1 = require("./dto/create-announcement.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    createTrainer(createTrainerDto) {
        return this.adminService.createTrainer(createTrainerDto);
    }
    getTrainers(specialty, isActive, page = 1, limit = 10) {
        return this.adminService.getTrainers({
            specialty,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            page,
            limit,
        });
    }
    getTrainerById(id) {
        return this.adminService.getTrainerById(id);
    }
    updateTrainer(id, updateTrainerDto) {
        return this.adminService.updateTrainer(id, updateTrainerDto);
    }
    deactivateTrainer(id) {
        return this.adminService.deactivateTrainer(id);
    }
    deleteTrainer(id) {
        return this.adminService.deleteTrainer(id);
    }
    createAnnouncement(announcementDto) {
        return this.adminService.createAnnouncement(announcementDto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Post)('trainers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_trainer_dto_1.CreateTrainerDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createTrainer", null);
__decorate([
    (0, common_1.Get)('trainers'),
    __param(0, (0, common_1.Query)('specialty')),
    __param(1, (0, common_1.Query)('isActive')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTrainers", null);
__decorate([
    (0, common_1.Get)('trainers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTrainerById", null);
__decorate([
    (0, common_1.Put)('trainers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_trainer_dto_1.UpdateTrainerDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateTrainer", null);
__decorate([
    (0, common_1.Patch)('trainers/:id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deactivateTrainer", null);
__decorate([
    (0, common_1.Delete)('trainers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteTrainer", null);
__decorate([
    (0, common_1.Post)('announcements'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_announcement_dto_1.CreateAnnouncementDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createAnnouncement", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map