import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { TrainerModule } from './trainer/trainer.module';
import { MembersModule } from './members/members.module';
import { AdminUserEntity } from './admin/entities/admin-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',     // change to your postgres username
      password: 'admin', // change to your postgres password
      database: 'fittrack_db',  // change to your database name
      entities: [AdminUserEntity],
      synchronize: true,        // auto-creates tables from entities — only for dev
    }),
    AdminModule,
    TrainerModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}