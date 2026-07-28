import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class UpdateClassDto {
  @IsNotEmpty({ message: 'Class name is required' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'Trainer name is required' })
  @IsString()
  trainer!: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString()
  date!: string;

  @IsNotEmpty({ message: 'Time is required' })
  @IsString()
  time!: string;

  @IsNotEmpty({ message: 'Capacity is required' })
  @IsNumber()
  capacity!: number;
}