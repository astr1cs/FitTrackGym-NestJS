import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // Required so other modules (like MembersModule) can use MailService
})
export class MailModule {}