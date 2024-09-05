// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ACTIONS_CORS_HEADERS } from '@solana/actions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: Object.keys(ACTIONS_CORS_HEADERS),
    credentials: true,
  });
  

  app.use((req, res, next) => {
    Object.keys(ACTIONS_CORS_HEADERS).forEach(header => {
      res.header(header, ACTIONS_CORS_HEADERS[header]);
    });
    next();
  });

  await app.listen(process.env.PORT || 3008)
}
bootstrap();