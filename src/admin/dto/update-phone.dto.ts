import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UpdatePhoneDto {
  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString({}, { message: 'Phone must contain only numbers' })
  phone!: string;
}