import { IsNotEmpty, IsString, IsEmail, Matches, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password!: string;

  @IsNotEmpty({ message: 'Email Address is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[^\s@]+@[^\s@]+\.com$/, {
    message: 'Email must be a valid .com domain address',
  })
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}