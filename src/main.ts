import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import setDefaultUser from './config/default.user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  initSwagger(app)
  setDefaultUser(config)

  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
  }))
  const logger = new Logger();

  await app.listen(3000);

  logger.log(`Server is running in ${await app.getUrl()}`)
}
bootstrap();
