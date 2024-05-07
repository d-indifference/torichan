import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as process from 'node:process';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { sessionConfig } from '@config/session.config';
import * as fs from 'fs-extra';
import { NotFoundExceptionFilter } from '@utils/filters/exceptions';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('http.port');

  const staticDirectory = path.join(process.cwd(), config.getOrThrow('paths.public'));
  const viewsDirectory = path.join(process.cwd(), config.getOrThrow('paths.views'));
  const filesDirectory = path.join(process.cwd(), config.getOrThrow('paths.files'));

  app.useStaticAssets(staticDirectory);
  app.setBaseViewsDir(viewsDirectory);
  app.setViewEngine('ejs');

  app.use(cookieParser());
  app.use(session(sessionConfig(config)));

  await fs.ensureDir(filesDirectory);

  app.useGlobalFilters(new NotFoundExceptionFilter());

  await app.listen(port);

  Logger.log(`🐦 Torichan Engine has been successfully started on port: ${port}`, 'main');
};

bootstrap().then();
