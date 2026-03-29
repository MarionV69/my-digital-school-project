import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true, // to add if cookies
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Global serialization interceptor for class-transformer decorators (e.g., @Exclude)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Enable CORS
  app.enableCors();

  // Swagger API documentation
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('B2B Platform API - Le bon fournisseur')
      .setDescription('API for connecting restaurants with suppliers')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication and user management')
      .addTag('users', 'User operations')
      .addTag('establishments', 'Establishment management')
      .addTag('suppliers', 'Supplier management and search')
      .addTag(
        'documents',
        'Establishment document management (logo, cover photo, gallery photos, catalog PDF)',
      )
      .addTag('favorites', 'Restaurant favorites management')
      .addTag('conversations', 'Messaging system')
      .addTag('reviews', 'Reviews and ratings')
      .build(),
  );
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API documentation available at: http://localhost:${port}/docs`);
}
void bootstrap();
