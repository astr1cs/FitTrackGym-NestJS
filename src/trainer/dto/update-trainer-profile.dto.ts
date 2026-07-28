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

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase character',
  })
  password?: string;

  @IsOptional()
  @IsIn(['male', 'female'], { message: 'Gender must be male or female' })
  gender?: 'male' | 'female';

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
