import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import { CreateTrainerDto } from './admin/dto/create-trainer.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Route 1: GET - Dashboard Statistics
  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Route 2: POST - Create Trainer
  @Post('trainers')
  createTrainer(@Body() createTrainerDto: CreateTrainerDto) {
    return this.adminService.createTrainer(createTrainerDto);
  }
}