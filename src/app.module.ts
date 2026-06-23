import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TrainerModule } from './trainer/trainer.module';

@Module({
  imports: [AdminModule, TrainerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}