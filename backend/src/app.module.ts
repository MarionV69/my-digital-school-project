import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // dev only - not in production!
    }),
    UsersModule,
    RestaurantsModule,
    SuppliersModule,
    ReviewsModule,
    ConversationsModule,
    AuthModule,
    FilesModule,
    CommonModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
