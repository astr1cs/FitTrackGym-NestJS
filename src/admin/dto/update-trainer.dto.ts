import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTrainerDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  // Lab Task 2 — Pipes: Category 3 rule — phone starts with 01
  @IsOptional()
  @IsString()
  @Matches(/^01\d+$/, { message: 'Phone number must start with 01' })
  phone?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // Lab Task 2 — Pipes: Category 3 rule — password min 6 + lowercase
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase character',
  })
  password?: string;
}