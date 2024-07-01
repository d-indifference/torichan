import { FileSystemStoredFile, IsFile, MaxFileSize } from 'nestjs-form-data';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { isUndefined } from 'lodash';
import { LOCALE } from '@utils/locale';

export class CommentCreateDto {
  @IsString(LOCALE.validators['isString']('nya'))
  @IsOptional()
  nya?: string;

  @IsString(LOCALE.validators['isString']('name'))
  @IsOptional()
  @MaxLength(256, LOCALE.validators['maxLength']('name'))
  name?: string;

  @IsString(LOCALE.validators['isString']('options'))
  @IsOptional()
  @MaxLength(512, LOCALE.validators['maxLength']('options', 512))
  options?: string;

  @IsString(LOCALE.validators['isString']('subject'))
  @IsOptional()
  @MaxLength(256, LOCALE.validators['maxLength']('subject', 256))
  subject?: string;

  @IsString(LOCALE.validators['isString']('comment'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('comment'))
  @MinLength(3, LOCALE.validators['minLength']('comment', 3))
  comment: string;

  @IsFile(LOCALE.validators['isFile']('file'))
  @IsOptional()
  @MaxFileSize(20e6 - 1, LOCALE.validators['maxFileSize']('file', 20e6 - 1))
  file?: FileSystemStoredFile;

  @IsString(LOCALE.validators['isString']('password'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('password'))
  @MinLength(8, LOCALE.validators['minLength']('password', 8))
  @MaxLength(8, LOCALE.validators['maxLength']('password', 8))
  password: string;

  @IsString(LOCALE.validators['isString']('captcha'))
  @IsOptional()
  captcha?: string;

  @IsString(LOCALE.validators['isString']('isAdmin'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('password', 2))
  isAdmin: 'on' | undefined;

  public toCreateInput(displayNumber: number, ip: string): Prisma.CommentCreateInput {
    return {
      displayNumber,
      ip,
      name: this.name,
      options: this.options,
      subject: this.subject,
      comment: this.comment,
      password: this.password,
      isAdmin: !isUndefined(this.isAdmin),
      tripcode: null
    };
  }

  public toString(): string {
    return `{"name": ${this.name}, "options": ${this.options},"subject": ${this.subject}, "comment": ${this.comment}, "password": ${this.password}, "isAdmin": ${this.isAdmin} }`;
  }
}
