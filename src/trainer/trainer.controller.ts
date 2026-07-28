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
import { UpdateTrainerProfileDto } from './dto/update-trainer-profile.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailValidationPipe } from './pipes/email-validation.pipe';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  // 1. POST /trainer/auth/register - Trainer Registration (BCrypt & Pipe)
  @Post('auth/register')
  @UsePipes(new EmailValidationPipe())
  register(@Body() registerTrainerDto: RegisterTrainerDto) {
    return this.trainerService.register(registerTrainerDto);
  }

  // 2. POST /trainer/auth/login - Trainer Login & JWT Token
  @Post('auth/login')
  login(@Body() loginTrainerDto: LoginTrainerDto) {
    return this.trainerService.login(loginTrainerDto);
  }

  // 3. GET /trainer/classes - Get Classes (Query filter & pagination)
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

  // 4. POST /trainer/classes - Schedule New Class Session
  @Post('classes')
  createClass(@Body() createClassDto: CreateClassDto) {
    return this.trainerService.createClass(createClassDto);
  }

  // 5. PUT /trainer/profile - Update Full Profile (One-to-One)
  @Put('profile')
  @UsePipes(new EmailValidationPipe())
  updateProfile(
    @Body() updateTrainerProfileDto: UpdateTrainerProfileDto,
    @Req() req: any,
  ) {
    const trainerId = req.user?.userId;
    return this.trainerService.updateProfile(updateTrainerProfileDto, trainerId);
  }

  // 6. PATCH /trainer/classes/:id - Partial Update Class Session
  @Patch('classes/:id')
  updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.trainerService.updateClass(id, updateClassDto);
  }

  // 7. DELETE /trainer/classes/:id - Cancel/Delete Class Session
  @Delete('classes/:id')
  deleteClass(@Param('id') id: string) {
    return this.trainerService.deleteClass(id);
  }

  // 8. POST /trainer/mail/send-schedule - Send Schedule Email via Google SMTP
  @Post('mail/send-schedule')
  sendScheduleMail(@Body() dto: SendEmailDto) {
    return this.trainerService.sendScheduleMail(dto);
  }
}
