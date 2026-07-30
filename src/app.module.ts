import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MembersModule } from './members/members.module';
// import { MailModule } from './mail/mail.module'; // Uncomment this if you generated a separate MailModule
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // 1. Database Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'PG13579@', // Replace with your PostgreSQL password
      database: 'gym_db',        // Replace with your database name
      autoLoadEntities: true,
      synchronize: true,         // Auto-creates tables based on entities
    }),
    
    // 2. Mailer Configuration
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Replace with your SMTP host (e.g., Mailtrap, SendGrid, Gmail)
        port: 587,
        auth: {
          user: 'shadab.fardin0234@gmail.com', // Replace with your SMTP user
          pass: 'rycw qbit prqq irti', // Replace with your SMTP password
        },
      },
      defaults: {
        from: '"FitTrack Gym" <shadab.fardin0234@gmail.com>', // Default sender address
      },
    }),

    // 3. Feature Modules
    MembersModule,

    MailModule,
    // MailModule, // Add this if you created the separate mail module
  ],
})
export class AppModule {}