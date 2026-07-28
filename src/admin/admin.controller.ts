import {
  Controller,
  Get,
  Post,
  Put,
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
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Route 3: GET /admin/profile — One to One relationship
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.adminService.getProfile(req.user.id);
  }

  // Route 4: PUT /admin/profile — One to One relationship + Pipes
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.adminService.updateProfile(req.user.id, updateProfileDto);
  }

  // Route 5: POST /admin/trainers — One to Many + BCrypt + Pipes
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

  // Route 6: GET /admin/trainers — One to Many relationship
  @UseGuards(JwtAuthGuard)
  @Get('trainers')
  getTrainers() {
    return this.adminService.getTrainers();
  }

  // Route 7: DELETE /admin/trainers/:id — TypeORM + HttpException
  @UseGuards(JwtAuthGuard)
  @Delete('trainers/:id')
  deleteTrainer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteTrainer(id);
  }
}