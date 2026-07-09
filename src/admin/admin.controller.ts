import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch,
  Delete,
  Body, 
  Param, 
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── existing routes (Lab Task 1 & 2 — unchanged) ────────────────────────

  // Route 1: GET - Dashboard Statistics
  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Route 2: POST - Create Trainer
  // Lab Task 2 — Pipes: Category 3 rule — certification file must be a PDF
  @Post('trainers')
  @UseInterceptors(FileInterceptor('certificateFile'))
  createTrainer(
    @Body() createTrainerDto: CreateTrainerDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'application/pdf' }),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      }),
    )
    certificateFile?: Express.Multer.File,
  ) {
    return this.adminService.createTrainer(createTrainerDto, certificateFile);
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

  // ─── Lab Task 3 — TypeORM: Category 2 operations ─────────────────────────

  // Operation 1: Create a user
  @Post('users')
  createAdminUser(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.adminService.createAdminUser(createAdminUserDto);
  }

  // Operation 2: Modify the phone number of an existing user
  @Patch('users/:id/phone')
  updatePhone(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ) {
    return this.adminService.updatePhone(id, updatePhoneDto);
  }

  // Operation 3: Retrieve users with null values in the fullName column
  @Get('users/null-fullname')
  getUsersWithNullFullName() {
    return this.adminService.getUsersWithNullFullName();
  }

  // Operation 4: Remove a user from the system based on their id
  @Delete('users/:id')
  removeAdminUser(@Param('id') id: string) {
    return this.adminService.removeAdminUser(id);
  }
}