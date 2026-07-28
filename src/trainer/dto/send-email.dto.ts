import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty({ message: 'Recipient email address is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  recipientEmail: string;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  subject: string;

  @IsNotEmpty({ message: 'Message content is required' })
  @IsString()
  messageContent: string;

  @IsOptional()
  @IsString()
  memberName?: string;
}
