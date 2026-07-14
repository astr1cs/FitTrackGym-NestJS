import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, IsIn } from 'class-validator';

export class CreateTrainerUserDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName!: string;

  @IsNotEmpty({ message: 'Age is required' })
  @IsInt({ message: 'Age must be an integer' })
  @Min(0, { message: 'Age must be an unsigned integer (>= 0)' })
  age!: number;

  @IsOptional()
  @IsIn(['active', 'inactive'], { message: 'Status must be active or inactive' })
  status?: string;
}
