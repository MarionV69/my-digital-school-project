import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../conversations/entities/message.entity';
import { Document } from '../documents/entities/document.entity';
import { Establishment } from '../establishments/entities/establishment.entity';
import { StoredFile } from '../files/entities/stored-file.entity';
import { Review } from '../reviews/entities/review.entity';
import { Label } from '../suppliers/entities/label.entity';
import { ProductCategory } from '../suppliers/entities/product-category.entity';
import { SupplierAttributes } from '../suppliers/entities/supplier-attributes.entity';
import { User } from '../users/entities/user.entity';
import { Favorite } from '../favorites/entities/favorite.entity';

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
      entities: [
        Label,
        ProductCategory,
        User,
        Establishment,
        SupplierAttributes,
        StoredFile,
        Document,
        Conversation,
        Message,
        Review,
        Favorite,
      ],
      synchronize: true, // ok pour dev
    }),
  ],
})
export class SeedModule {}
