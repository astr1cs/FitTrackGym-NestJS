import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch,
  Delete,
  Body, 
  Param, 
  Query 
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

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

  // Route 3: GET - Get All Trainers with Filters
  @Get('trainers')
  getTrainers(
    @Query('specialty') specialty?: string,
    @Query('isActive') isActive?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.adminService.getTrainers({
      specialty,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      page,
      limit,
    });
  }

  // Route 4: GET - Get Single Trainer by ID
  @Get('trainers/:id')
  getTrainerById(@Param('id') id: string) {
    return this.adminService.getTrainerById(id);
  }

  // Route 5: PUT - Update Trainer
  @Put('trainers/:id')
  updateTrainer(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.adminService.updateTrainer(id, updateTrainerDto);
  }

  // Route 6: PATCH - Deactivate Trainer
  @Patch('trainers/:id/deactivate')
  deactivateTrainer(@Param('id') id: string) {
    return this.adminService.deactivateTrainer(id);
  }

  // Route 7: DELETE - Delete Trainer
  @Delete('trainers/:id')
  deleteTrainer(@Param('id') id: string) {
    return this.adminService.deleteTrainer(id);
  }

  // Route 8: POST - Create Announcement
  @Post('announcements')
  createAnnouncement(@Body() announcementDto: CreateAnnouncementDto) {
    return this.adminService.createAnnouncement(announcementDto);
  }
}