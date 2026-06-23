import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty({ message: 'Class name is required' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'Trainer ID is required' })
  @IsString()
  trainerId!: string;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsString()
  startTime!: string;

  @IsNotEmpty({ message: 'End time is required' })
  @IsString()
  endTime!: string;

  @IsOptional()
  @IsString()
  room?: string;

  @IsOptional()
  @IsNumber()
  maxCapacity?: number;
}
