import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TrainerModule } from './trainer/trainer.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [AdminModule, TrainerModule,MembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}