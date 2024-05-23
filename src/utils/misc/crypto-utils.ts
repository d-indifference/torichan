import * as CryptoJS from 'crypto-js';

export class CryptoUtils {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  public encrypt(str: string): string {
    return CryptoJS.AES.encrypt(str, this.key).toString();
  }

  public decrypt(str: string): string {
    const bytes = CryptoJS.AES.decrypt(str, this.key);

    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
