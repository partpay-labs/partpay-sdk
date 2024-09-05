import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
      credentials: true,
    });

    await app.listen(process.env.PORT || 3004, "0.0.0.0");
  } catch (error) {
    process.exit(1);
  }
}

bootstrap().catch(err => {
  process.exit(1);
});