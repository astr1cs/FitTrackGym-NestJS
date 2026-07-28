import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class RegisterTrainerDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  fullName: string;

  // Category 2 requirement: Email must contain @aiub.edu
  @IsNotEmpty({ message: 'Email address field is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @Matches(/@aiub\.edu$/, {
    message: 'Email address input must contain aiub.edu domain',
  })
  email: string;

  // Category 2 requirement: Password >= 6 chars with at least 1 Uppercase letter
  @IsNotEmpty({ message: 'Password field is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one Uppercase character',
  })
  password: string;

  // Category 2 requirement: Phone number only numbers
  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'Phone number field must contain only numbers' })
  phone?: string;

  // Category 2 requirement: Gender male or female
  @IsOptional()
  @IsIn(['male', 'female'], { message: 'Gender must be male or female' })
  gender?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  age?: number;

  @IsOptional()
  @IsString()
  specialization?: string;
}
