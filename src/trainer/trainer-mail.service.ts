import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class TrainerMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendScheduleNotification(dto: SendEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: dto.recipientEmail,
        subject: `[FitTrack Gym] Class Schedule Update: ${dto.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4CAF50;">FitTrack Gym Class Schedule</h2>
            <p>Hello ${dto.memberName || 'Member'},</p>
            <p>Your trainer has updated/scheduled a class session for you:</p>
            <blockquote style="background: #f4f4f4; padding: 10px; border-left: 4px solid #4CAF50;">
              ${dto.messageContent}
            </blockquote>
            <p>Thank you,<br/><strong>FitTrack Gym Trainer Team</strong></p>
          </div>
        `,
      });
      return {
        success: true,
        message: `Schedule notification email sent to ${dto.recipientEmail} via Google SMTP`,
      };
    } catch (error) {
      // Return clear response even if SMTP credentials are mock/local
      return {
        success: false,
        message: `Mail attempt recorded for ${dto.recipientEmail} (${error.message || 'SMTP Connection'})`,
      };
    }
  }

  async sendReminderEmail(dto: SendEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: dto.recipientEmail,
        subject: `[FitTrack Gym Reminder] ${dto.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2196F3;">FitTrack Gym Workout Reminder</h2>
            <p>Hello ${dto.memberName || 'Member'},</p>
            <p>${dto.messageContent}</p>
            <p>Stay consistent!</p>
          </div>
        `,
      });
      return {
        success: true,
        message: `Reminder email sent successfully to ${dto.recipientEmail}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Reminder email simulated for ${dto.recipientEmail} (${error.message || 'SMTP status'})`,
      };
    }
  }
}
