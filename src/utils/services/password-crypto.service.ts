import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoUtils } from '@utils/misc';

@Injectable()
export class PasswordCryptoService {
  constructor(private readonly config: ConfigService) {}

  public encrypt(password: string): string {
    const key = this.config.getOrThrow('secure.secret.password');
    const crypto = new CryptoUtils(key);

    return crypto.encrypt(password);
  }

  public decrypt(password: string): string {
    const key = this.config.getOrThrow('secure.secret.password');
    const crypto = new CryptoUtils(key);

    return crypto.decrypt(password);
  }
}
