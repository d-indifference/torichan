import { FileSystemStoredFile, IsFile, MaxFileSize } from 'nestjs-form-data';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';
import { isUndefined } from 'lodash';

export class CommentCreateDto {
  @IsString()
  @IsOptional()
  nya?: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(512)
  options?: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  subject?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(2048)
  comment: string;

  @IsFile()
  @IsOptional()
  @MaxFileSize(20e6 - 1)
  file?: FileSystemStoredFile;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(8)
  password: string;

  @IsString()
  @IsOptional()
  captcha?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
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
