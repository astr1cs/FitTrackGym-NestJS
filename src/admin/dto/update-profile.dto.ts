import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;
}