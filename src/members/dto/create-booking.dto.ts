import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Class ID is required' })
  @IsString()
  class_id: string;
}