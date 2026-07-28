import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginTrainerDto {
  @IsNotEmpty({ message: 'Email address field is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password field is required' })
  @IsString()
  password: string;
}
