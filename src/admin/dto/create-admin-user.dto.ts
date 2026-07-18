import { IsBoolean, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateAdminUserDto {
  // fullName is nullable in the entity so optional here too
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName?: string | null;

  // phone is bigint unsigned — must be a positive number
  @IsNotEmpty({ message: 'Phone is required' })
  @IsPositive({ message: 'Phone must be a positive number' })
  phone!: number;

  // isActive defaults to true in entity but can be set on create
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}