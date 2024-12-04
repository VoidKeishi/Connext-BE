import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GatewaysAdapter } from './gateways/gateways.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const adapter = new GatewaysAdapter(app);
  // app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
