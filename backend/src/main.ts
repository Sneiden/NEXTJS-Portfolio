import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow requests from the Next.js frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Automatically validate all incoming request bodies using DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties from request body
      forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true,        // Automatically transform payloads to DTO types
    }),
  );

  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();