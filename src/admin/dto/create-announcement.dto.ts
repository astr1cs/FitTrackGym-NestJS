import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAnnouncementDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Body is required' })
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  target_role?: string;
}