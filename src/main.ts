import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknows fields
      forbidNonWhitelisted: true, // throw error if extra unknown fields received
      transform: true, // auto convert types based on dto
      stopAtFirstError: false,
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
