import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  // Pipe — password min 6 chars, must contain uppercase and lowercase
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase and one lowercase letter',
  })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}