import { IsNotEmpty, IsString, IsInt, Min, IsDateString } from 'class-validator';

export class CreateGymClassDto {
  @IsNotEmpty({ message: 'Class name is required' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'Trainer name is required' })
  @IsString()
  trainer!: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Invalid date format' })
  date!: string;

  @IsNotEmpty({ message: 'Time is required' })
  @IsString()
  time!: string;

  @IsNotEmpty({ message: 'Capacity is required' })
  @IsInt()
  @Min(1)
  capacity!: number;
}