import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Enable CORS
  app.enableCors();

  // Swagger API documentation
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('B2B Platform API - Le bon fournisseur')
      .setDescription('API for connecting restaurants with suppliers')
      .setVersion('1.0')
      .addTag('auth', 'Authentication and user management')
      .addTag('users', 'User operations')
      .addTag('restaurants', 'Restaurant management and favorites')
      .addTag('suppliers', 'Supplier management and search')
      .addTag('reviews', 'Reviews and ratings')
      .addTag('conversations', 'Messaging system')
      .addTag('files', 'File upload and management')
      .build(),
  );
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API documentation available at: http://localhost:${port}/docs`);
}
void bootstrap();
