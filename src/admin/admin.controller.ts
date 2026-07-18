import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AdminService } from './admin.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  // Route 1: GET /admin/dashboard
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ─── Profile routes (One to One relationship) ─────────────────────────────

  // Route 2: GET /admin/profile
  // Loads AdminUser with linked AdminProfile (One to One)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.adminService.getProfile(req.user.id);
  }

  // Route 3: PUT /admin/profile
  // Updates AdminProfile linked to logged-in admin (One to One)
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(
    @Request() req: any,
    @Body() body: { fullName?: string; phone?: string; country?: string },
  ) {
    return this.adminService.updateProfile(req.user.id, body);
  }

  // ─── AdminUser routes (Category 2 TypeORM operations) ────────────────────

  // Route 4: POST /admin/users
  @UseGuards(JwtAuthGuard)
  @Post('users')
  createAdminUser(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.adminService.createAdminUser(createAdminUserDto);
  }

  // Route 5: PATCH /admin/users/:id/phone
  @UseGuards(JwtAuthGuard)
  @Patch('users/:id/phone')
  updatePhone(
    @Param('id') id: string,
    @Body() updatePhoneDto: UpdatePhoneDto,
  ) {
    return this.adminService.updatePhone(id, updatePhoneDto);
  }

  // Route 6: GET /admin/users/null-fullname
  @UseGuards(JwtAuthGuard)
  @Get('users/null-fullname')
  getUsersWithNullFullName() {
    return this.adminService.getUsersWithNullFullName();
  }

  // Route 7: DELETE /admin/users/:id
  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  removeAdminUser(@Param('id') id: string) {
    return this.adminService.removeAdminUser(id);
  }

  // ─── Trainer routes (One to Many relationship) ────────────────────────────

  // Route 8: POST /admin/trainers
  // Lab Task 2 — Pipes: Category 3 — PDF certificate file validation
  // Creates trainer linked to logged-in admin (One to Many)
  @UseGuards(JwtAuthGuard)
  @Post('trainers')
  @UseInterceptors(FileInterceptor('certificateFile'))
  createTrainer(
    @Request() req: any,
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
    return this.adminService.createTrainer(
      req.user.id,
      createTrainerDto,
      certificateFile,
    );
  }

  // Route 9: GET /admin/trainers
  // Loads all trainers with their createdBy admin (One to Many)
  @UseGuards(JwtAuthGuard)
  @Get('trainers')
  getTrainers() {
    return this.adminService.getTrainers();
  }

  // Route 10: GET /admin/trainers/my
  // Loads only trainers created by logged-in admin (One to Many)
  @UseGuards(JwtAuthGuard)
  @Get('trainers/my')
  getMyTrainers(@Request() req: any) {
    return this.adminService.getTrainersByAdmin(req.user.id);
  }

  // Route 11: GET /admin/trainers/:id
  @UseGuards(JwtAuthGuard)
  @Get('trainers/:id')
  getTrainerById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getTrainerById(id);
  }

  // Route 12: PATCH /admin/trainers/:id
  @UseGuards(JwtAuthGuard)
  @Patch('trainers/:id')
  updateTrainer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrainerDto: UpdateTrainerDto,
  ) {
    return this.adminService.updateTrainer(id, updateTrainerDto);
  }

  // Route 13: DELETE /admin/trainers/:id
  @UseGuards(JwtAuthGuard)
  @Delete('trainers/:id')
  deleteTrainer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteTrainer(id);
  }

  // ─── Announcements ────────────────────────────────────────────────────────

  // Route 14: POST /admin/announcements
  @UseGuards(JwtAuthGuard)
  @Post('announcements')
  createAnnouncement(@Body() announcementDto: CreateAnnouncementDto) {
    return this.adminService.createAnnouncement(announcementDto);
  }

  // Route 15: GET /admin/announcements
  @UseGuards(JwtAuthGuard)
  @Get('announcements')
  getAllAnnouncements() {
    return this.adminService.getAllAnnouncements();
  }
}