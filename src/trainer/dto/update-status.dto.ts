import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['active', 'inactive'], { message: 'Status must be active or inactive' })
  status!: string;
}
