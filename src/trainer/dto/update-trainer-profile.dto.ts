import { IsOptional, IsEmail, Matches, IsIn, MinLength } from 'class-validator';

// Lab Task 2 — Pipes: Category 2
// Used by the Trainer role's own self-service profile update (PATCH /trainer/profile)
export class UpdateTrainerProfileDto {
  // Category 2 rule — email must be required and contain aiub.edu domain
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[^\s@]+@aiub\.edu$/, {
    message: 'Email must be an aiub.edu address',
  })
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
}