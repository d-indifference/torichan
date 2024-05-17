import { FileSystemStoredFile, IsFile, MaxFileSize } from 'nestjs-form-data';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CommentCreateDto {
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
  @MaxFileSize(3e6)
  file?: FileSystemStoredFile;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(8)
  password: string;

  public toCreateInput(displayNumber: number, ip: string): Prisma.CommentCreateInput {
    return {
      displayNumber,
      ip,
      name: this.name,
      options: this.options,
      subject: this.subject,
      comment: this.comment,
      password: this.password
    };
  }

  public toString(): string {
    return `{"name": ${this.name}, "options": ${this.options},"subject": ${this.subject}, "comment": ${this.comment}, "password": ${this.password}}`;
  }
}
