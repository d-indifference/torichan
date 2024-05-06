import { ConfigService } from '@nestjs/config';
import { SessionOptions } from 'express-session';

export const sessionConfig = (config: ConfigService): SessionOptions => ({
  secret: config.getOrThrow<string>('secure.secret.session'),
  resave: false,
  saveUninitialized: false
});
