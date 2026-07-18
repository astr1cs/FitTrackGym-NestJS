import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, MinLength, Matches } from 'class-validator';

export class CreateTrainerDto {
  // Lab Task 2 — Pipes: Category 3 rule — name must not contain any special character
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Name must not contain special characters',
  })
  name!: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  // Lab Task 2 — Pipes: Category 3 rule — password min 6 chars and must contain one lowercase character
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase character',
  })
  password!: string;

  // Lab Task 2 — Pipes: Category 3 rule — phone number must start with 01
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  @Matches(/^01\d+$/, {
    message: 'Phone number must start with 01',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  experience_years?: number;

  @IsOptional()
  @IsString()
  certification?: string;
}