import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdatePhoneDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsPositive({ message: 'Phone must be a positive number' })
  phone!: number;
}