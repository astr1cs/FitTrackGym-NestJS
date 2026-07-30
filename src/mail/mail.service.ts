import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService 
{
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(userEmail: string, userName: string) 
  {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Welcome to FitTrack Gym!',
        text: `Hello ${userName},\n\nWelcome to our gym! Your account is successfully set up. We are excited to have you on board.`,
      });
      this.logger.log(`Welcome email sent successfully to ${userEmail}`);
    } catch (error) 
    {
      const err = error as Error; // <-- Casts error to Error type
      this.logger.error(`Failed to send welcome email to ${userEmail}`, err.stack);
    }
  }

  async sendBookingConfirmation(userEmail: string, className: string, date: string)
   {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Class Booking Confirmed',
        text: `Your spot in ${className} on ${date} has been confirmed. See you there!`,
      });
      this.logger.log(`Booking confirmation email sent successfully to ${userEmail}`);
    } catch (error)
 {
      const err = error as Error; // <-- Casts error to Error type
      this.logger.error(`Failed to send booking confirmation email to ${userEmail}`, err.stack);
    }
  }
}