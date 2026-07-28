import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class TrainerMailService {
  constructor(private readonly mailerService: MailerService) {}

  // Automated Welcome Email sent upon user registration
  async sendWelcomeEmail(email: string, fullName: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '🎉 Welcome to FitTrack Gym System!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #4CAF50;">Welcome to FitTrack Gym, ${fullName}!</h2>
            <p>Dear ${fullName},</p>
            <p>Your trainer account has been successfully registered in our Gym Management System.</p>
            <p>You can now log in, manage your profile, schedule class sessions, and manage member activities.</p>
            <hr style="border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #777;">Best regards,<br/><strong>FitTrack Gym Administration Team</strong></p>
          </div>
        `,
      });
      return { success: true, message: `Welcome email sent to ${email}` };
    } catch (error) {
      return { success: false, message: `Welcome email failed: ${error.message}` };
    }
  }

  // Automated Class Schedule Email sent when a new class is created
  async sendClassCreatedNotification(
    email: string,
    className: string,
    startTime: string,
    room: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `📅 New Class Scheduled: ${className}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #2196F3;">Class Session Confirmation</h2>
            <p>Hello,</p>
            <p>A new class session has been scheduled successfully in the system:</p>
            <ul style="background: #f9f9f9; padding: 15px 25px; border-radius: 5px;">
              <li><strong>Class Name:</strong> ${className}</li>
              <li><strong>Start Time:</strong> ${startTime}</li>
              <li><strong>Room:</strong> ${room}</li>
            </ul>
            <p>Thank you,<br/><strong>FitTrack Gym Schedule Service</strong></p>
          </div>
        `,
      });
      return { success: true, message: `Class schedule email sent to ${email}` };
    } catch (error) {
      return { success: false, message: `Class schedule email failed: ${error.message}` };
    }
  }

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
      return {
        success: false,
        message: `Mail attempt recorded for ${dto.recipientEmail} (${error.message || 'SMTP Connection'})`,
      };
    }
  }
}
