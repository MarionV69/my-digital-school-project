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
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import {
  PUBLIC_STATIC_URL_PREFIX,
  PUBLIC_UPLOAD_PATH,
} from './config/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // dev only - not in production!
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_UPLOAD_PATH,
      serveRoot: PUBLIC_STATIC_URL_PREFIX, // Access files via /documents/:filename
    }),
    UsersModule,
    FilesModule,
    RestaurantsModule,
    SuppliersModule,
    ReviewsModule,
    ConversationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT Auth Guard (applies to all routes unless @Public() is used)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
