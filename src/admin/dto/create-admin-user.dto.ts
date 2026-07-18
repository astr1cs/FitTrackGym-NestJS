import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateAdminUserDto {
  // fullName is nullable in the entity so optional here too
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString({}, { message: 'Phone must contain only numbers' })
  phone!: string;
  
}