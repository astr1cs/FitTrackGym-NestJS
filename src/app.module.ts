import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
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
    MembersModule,
  ],
})
export class AppModule {}