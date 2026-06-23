import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Route 1: GET - Dashboard Statistics
  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}