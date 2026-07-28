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
  UseGuards,
  UsePipes,
  Req,
} from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { RegisterTrainerDto } from './dto/register-trainer.dto';
import { LoginTrainerDto } from './dto/login-trainer.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { UpdateTrainerProfileDto } from './dto/update-trainer-profile.dto';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { CreateTrainerUserDto } from './dto/create-trainer-user.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AiubEmailValidationPipe } from './pipes/aiub-email.pipe';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  // ─── AUTHENTICATION (PUBLIC) ─────────────────────────────────────────────

  // Route 1: POST /trainer/auth/register - Trainer Signup with BCrypt & Validation
  @Post('auth/register')
  @UsePipes(new AiubEmailValidationPipe())
  register(@Body() registerTrainerDto: RegisterTrainerDto) {
    return this.trainerService.register(registerTrainerDto);
  }

  // Route 2: POST /trainer/auth/login - Trainer Authentication & JWT Token
  @Post('auth/login')
  login(@Body() loginTrainerDto: LoginTrainerDto) {
    return this.trainerService.login(loginTrainerDto);
  }

  // ─── PROFILE MANAGEMENT (ONE-TO-ONE) ─────────────────────────────────────

  // Route 3: GET /trainer/profile - Get profile information
  @Get('profile')
  getProfile(@Req() req: any) {
    const trainerId = req.user?.userId;
    return this.trainerService.getProfile(trainerId);
  }

  // Route 4: PUT /trainer/profile - Update profile details with Category 2 validation
  @Put('profile')
  @UsePipes(new AiubEmailValidationPipe())
  updateProfile(
    @Body() updateTrainerProfileDto: UpdateTrainerProfileDto,
    @Req() req: any,
  ) {
    const trainerId = req.user?.userId;
    return this.trainerService.updateProfile(updateTrainerProfileDto, trainerId);
  }

  // Route 5: PATCH /trainer/profile - Partial profile update
  @Patch('profile')
  patchProfile(
    @Body() updateTrainerProfileDto: UpdateTrainerProfileDto,
    @Req() req: any,
  ) {
    const trainerId = req.user?.userId;
    return this.trainerService.updateProfile(updateTrainerProfileDto, trainerId);
  }

  // ─── CLASS SESSION MANAGEMENT (ONE-TO-MANY) ──────────────────────────────

  // Route 6: GET /trainer/classes - Get classes with filtering & pagination
  @Get('classes')
  getClasses(
    @Query('status') status?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.trainerService.getClasses({
      status,
      page: Number(page),
      limit: Number(limit),
    });
  }

  // Route 7: POST /trainer/classes - Schedule a new class session
  @Post('classes')
  createClass(@Body() createClassDto: CreateClassDto) {
    return this.trainerService.createClass(createClassDto);
  }

  // Route 8: GET /trainer/classes/:id - Get single class session details
  @Get('classes/:id')
  getClassById(@Param('id') id: string) {
    return this.trainerService.getClassById(id);
  }

  // Route 9: PATCH /trainer/classes/:id - Update class session details
  @Patch('classes/:id')
  updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.trainerService.updateClass(id, updateClassDto);
  }

  // Route 10: DELETE /trainer/classes/:id - Cancel/delete class session
  @Delete('classes/:id')
  deleteClass(@Param('id') id: string) {
    return this.trainerService.deleteClass(id);
  }

  // ─── ATTENDANCE MANAGEMENT (MANY-TO-ONE) ─────────────────────────────────

  // Route 11: POST /trainer/classes/:classId/attendance - Record member attendance
  @Post('classes/:classId/attendance')
  recordAttendance(
    @Param('classId') classId: string,
    @Body() recordAttendanceDto: RecordAttendanceDto,
  ) {
    return this.trainerService.recordAttendance(classId, recordAttendanceDto);
  }

  // Route 12: GET /trainer/classes/:classId/attendance - Get attendance roster
  @Get('classes/:classId/attendance')
  getAttendance(@Param('classId') classId: string) {
    return this.trainerService.getAttendance(classId);
  }

  // ─── CLIENT MANAGEMENT ──────────────────────────────────────────────────

  // Route 13: GET /trainer/clients - View assigned clients
  @Get('clients')
  getClients() {
    return this.trainerService.getClients();
  }

  // ─── WORKOUT PLANS (ONE-TO-MANY) ──────────────────────────────────────────

  // Route 14: POST /trainer/workout-plans - Create workout plan for a member
  @Post('workout-plans')
  createWorkoutPlan(@Body() dto: CreateWorkoutPlanDto) {
    return this.trainerService.createWorkoutPlan(dto);
  }

  // Route 15: GET /trainer/workout-plans - Get created workout plans
  @Get('workout-plans')
  getWorkoutPlans() {
    return this.trainerService.getWorkoutPlans();
  }

  // Route 16: DELETE /trainer/workout-plans/:id - Delete a workout plan
  @Delete('workout-plans/:id')
  deleteWorkoutPlan(@Param('id') id: string) {
    return this.trainerService.deleteWorkoutPlan(id);
  }

  // ─── MAILER NOTIFICATIONS (GOOGLE SMTP) ───────────────────────────────────

  // Route 17: POST /trainer/mail/send-schedule - Send schedule update email via Google SMTP
  @Post('mail/send-schedule')
  sendScheduleMail(@Body() dto: SendEmailDto) {
    return this.trainerService.sendScheduleMail(dto);
  }

  // Route 18: POST /trainer/mail/send-reminder - Send member workout reminder email
  @Post('mail/send-reminder')
  sendReminderMail(@Body() dto: SendEmailDto) {
    return this.trainerService.sendReminderMail(dto);
  }

  // ─── TYPEORM USERS (CATEGORY 1) ───────────────────────────────────────────

  @Post('users')
  createTrainerUser(@Body() createTrainerUserDto: CreateTrainerUserDto) {
    return this.trainerService.createTrainerUser(createTrainerUserDto);
  }

  @Patch('users/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.trainerService.updateStatus(Number(id), updateStatusDto);
  }

  @Get('users')
  getUsersByStatus(@Query('status') status?: string) {
    return this.trainerService.getUsersByStatus(status);
  }
}