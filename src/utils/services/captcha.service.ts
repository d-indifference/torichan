import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as svgCaptcha from 'svg-captcha';
import { CaptchaDto } from '@frontend/dto';
import { CryptoUtils } from '@utils/misc';
import { LOCALE } from '@utils/locale';

@Injectable()
export class CaptchaService {
  constructor(private readonly config: ConfigService) {}

  public generateCaptcha(): CaptchaDto {
    const captchaCryptoKey = this.config.getOrThrow('secure.secret.captcha');
    const crypto = new CryptoUtils(captchaCryptoKey);
    const captcha = this.create();

    return new CaptchaDto(captcha.data, crypto.encrypt(captcha.text));
  }

  public solveCaptcha(input: string, answer: string): void {
    const captchaCryptoKey = this.config.getOrThrow('secure.secret.captcha');
    const crypto = new CryptoUtils(captchaCryptoKey);

    const decryptedAnswer = crypto.decrypt(answer);

    if (input !== decryptedAnswer) {
      throw new ForbiddenException(LOCALE.utils['captchaIsInvalid']);
    }
  }

  private create(): svgCaptcha.CaptchaObj {
    const size = this.config.getOrThrow<number>('captcha.size');
    const ignoreChars = this.config.getOrThrow<string>('captcha.ignoreChars');
    const noise = this.config.getOrThrow<number>('captcha.noise');
    const color = this.config.getOrThrow<boolean>('captcha.color');
    const background = this.config.getOrThrow<string>('captcha.background');

    return svgCaptcha.create({ size, ignoreChars, noise, color, background });
  }
}
