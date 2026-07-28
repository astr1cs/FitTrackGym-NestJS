import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateWorkoutPlanDto {
  @IsNotEmpty({ message: 'Plan title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Member ID is required' })
  @IsString()
  memberId: string;

  @IsNotEmpty({ message: 'Member name is required' })
  @IsString()
  memberName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Exercises list is required' })
  @IsString()
  exercises: string;

  @IsOptional()
  @IsString()
  difficultyLevel?: string;
}
