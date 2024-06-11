export class CaptchaDto {
  data: string;

  text: string;

  constructor(data: string, text: string) {
    this.data = data;
    this.text = text;
  }
}
