import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { GatewaysAdapter } from './gateways/gateways.adapter';
import { AppModule } from './app.module';
import { ALLOW_LIST } from './common/constants/allow-list.contant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: function (origin, callback) {
      if (ALLOW_LIST.includes(origin) || !origin) {
        return callback(null, true);
      }
      return callback(new BadRequestException('CORS Error'));
    },
    credentials: true,
  });
  const adapter = new GatewaysAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.use(helmet());
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
