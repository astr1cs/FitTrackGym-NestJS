import { IsOptional, IsString, IsEmail, IsEnum, Matches, IsEmpty, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateProfileDto 
{
  //name should contain only alphabets
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, 
  {
    message: 'Name should contain only alphabets',
  })
  name?: string;

  //email must be required and contain @ and a .xyz domain
  @IsNotEmpty({ message: 'Email Address is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[^\s@]+@[^\s@]+\.xyz$/, 
  {
     message: 'Email must be a valid .xyz domain address',
  })
  email!: string; // Note: removed the '?' because it is no longer optional
  
  //validate NID number format (10, 13, or 17 digit NID)
  @IsOptional()
  @Matches(/^(\d{10}|\d{13}|\d{17})$/,
  {
    message: 'NID must be a valid 10, 13, or 17 digit number',
  })
  nid?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Date of Birth is required' })
  @IsDateString({}, { message: 'Invalid date format' })
  date_of_birth?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'])
  gender?: string;

  @IsOptional()
  @IsString()
  fitness_goal?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_phone?: string;
}