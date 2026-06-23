import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { RecordAttendanceDto } from './dto/record-attendance.dto';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  // Route 1: GET - Get all classes (with optional filters)
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

  // Route 2: POST - Schedule a new class session
  @Post('classes')
  createClass(@Body() createClassDto: CreateClassDto) {
    return this.trainerService.createClass(createClassDto);
  }

  // Route 3: GET - Get single class details
  @Get('classes/:id')
  getClassById(@Param('id') id: string) {
    return this.trainerService.getClassById(id);
  }

  // Route 4: PATCH - Update class session details
  @Patch('classes/:id')
  updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.trainerService.updateClass(id, updateClassDto);
  }

  // Route 5: DELETE - Cancel/delete class session
  @Delete('classes/:id')
  deleteClass(@Param('id') id: string) {
    return this.trainerService.deleteClass(id);
  }

  // Route 6: POST - Record attendance for a class session
  @Post('classes/:classId/attendance')
  recordAttendance(
    @Param('classId') classId: string,
    @Body() recordAttendanceDto: RecordAttendanceDto,
  ) {
    return this.trainerService.recordAttendance(classId, recordAttendanceDto);
  }

  // Route 7: GET - Get attendance roster for a class session
  @Get('classes/:classId/attendance')
  getAttendance(@Param('classId') classId: string) {
    return this.trainerService.getAttendance(classId);
  }

  // Route 8: GET - View client roster
  @Get('clients')
  getClients() {
    return this.trainerService.getClients();
  }
}
