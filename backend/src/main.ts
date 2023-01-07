import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  });
  const configService = app.get<ConfigService>(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Vending Machine backend')
    .setDescription('')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(configService.get<string>('PORT') || 3001);
  console.log(`Application is listening on: ${await app.getUrl()}`);
}
bootstrap();
