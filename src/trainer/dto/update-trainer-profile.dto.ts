import {
  IsOptional,
  IsEmail,
  Matches,
  IsIn,
  MinLength,
  IsString,
  IsNumber,
} from 'class-validator';

export class UpdateTrainerProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  // Category 2 rule — password min 6 chars and must contain one uppercase character
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase character',
  })
  password?: string;

  // Category 2 rule — gender must be male or female
  @IsOptional()
  @IsIn(['male', 'female'], { message: 'Gender must be male or female' })
  gender?: 'male' | 'female';

  // Category 2 rule — phone number must contain only numbers
  @IsOptional()
  @Matches(/^\d+$/, {
    message: 'Phone number must contain only numbers',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  certification?: string;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;
}