import { IsOptional, IsString, IsEmail, IsEnum, Matches } from 'class-validator';

export class UpdateProfileDto {
  // Lab Task 2 — Pipes: Category 1 rule — name should contain only alphabets
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name should contain only alphabets',
  })
  name?: string;

  // Lab Task 2 — Pipes: Category 1 rule — email must be required and contain @ and a .xyz domain
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[^\s@]+@[^\s@]+\.xyz$/, {
    message: 'Email must be a valid .xyz domain address',
  })
  email?: string;

  // Lab Task 2 — Pipes: Category 1 rule — validate NID number format (10, 13, or 17 digit NID)
  @IsOptional()
  @Matches(/^(\d{10}|\d{13}|\d{17})$/, {
    message: 'NID must be a valid 10, 13, or 17 digit number',
  })
  nid?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  date_of_birth?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'])
  gender?: string;

  @IsOptional()
  @IsString()
  fitness_goal?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone?: string;
}