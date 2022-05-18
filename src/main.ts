import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(morgan('tiny'));
  await app.listen(parseInt(process.env.PORT) || 3000);
})();
