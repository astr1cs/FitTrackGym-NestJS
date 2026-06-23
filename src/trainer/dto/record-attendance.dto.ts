import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class RecordAttendanceDto {
  @IsNotEmpty({ message: 'Member ID is required' })
  @IsString()
  memberId!: string;

  @IsNotEmpty({ message: 'Member Name is required' })
  @IsString()
  memberName!: string;

  @IsNotEmpty({ message: 'Attendance status is required' })
  @IsString()
  @IsIn(['present', 'absent'], { message: 'Status must be present or absent' })
  status!: 'present' | 'absent';
}
