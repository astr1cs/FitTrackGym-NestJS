import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Route 1: Dashboard Statistics (GET)
  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Route 2: Create Trainer (POST)
  @Post('trainers')
  createTrainer(@Body() createTrainerDto: CreateTrainerDto) {
    return this.adminService.createTrainer(createTrainerDto);
  }
}