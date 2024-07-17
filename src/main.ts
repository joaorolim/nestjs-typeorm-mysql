import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  // Para usar o interceptor globalmente, basta colocar na aplicação:
  // app.useGlobalInterceptors(new LogInterceptor());

  // Utilize o método embutido do NestJS para lidar com os eventos de desligamento
  app.enableShutdownHooks();

  await app.listen(3002);
}
bootstrap();
