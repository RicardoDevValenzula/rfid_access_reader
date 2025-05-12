import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // convierte strings → number / boolean
      whitelist: true, // elimina propiedades extra
      forbidNonWhitelisted: true, // lanza 400 si llegan props desconocidas
    }),
  );

  // --- CORS ---
  app.enableCors({
    origin: ['http://localhost:3001'], // front
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-admin-key', // ← añade tu header custom
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
