import { FileAttachmentMode, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeBoolean, normalizeInteger } from '@utils/misc';
import { LOCALE } from '@utils/locale';

export class BoardCreateDto {
  @IsString(LOCALE.validators['isString']('slug'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('slug'))
  @MaxLength(256, LOCALE.validators['maxLength']('slug', 256))
  slug: string;

  @IsString(LOCALE.validators['isString']('name'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('name'))
  @MaxLength(256, LOCALE.validators['maxLength']('name', 256))
  name: string;

  @IsString(LOCALE.validators['isString']('visible'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('visible', 2))
  visible: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('description'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('description'))
  @MinLength(3, LOCALE.validators['minLength']('description', 3))
  @MaxLength(1024, LOCALE.validators['maxLength']('description', 1024))
  description: string;

  @IsString(LOCALE.validators['isString']('allowPosting'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('allowPosting', 2))
  allowPosting: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('strictAnonymity'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('strictAnonymity', 2))
  strictAnonymity: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('threadFileAttachmentMode'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('threadFileAttachmentMode'))
  @IsEnum(FileAttachmentMode, LOCALE.validators['isEnum']('threadFileAttachmentMode'))
  threadFileAttachmentMode: FileAttachmentMode;

  @IsString(LOCALE.validators['isString']('replyFileAttachmentMode'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('replyFileAttachmentMode'))
  @IsEnum(FileAttachmentMode, LOCALE.validators['isEnum']('replyFileAttachmentMode'))
  replyFileAttachmentMode: FileAttachmentMode;

  @IsString(LOCALE.validators['isString']('delayAfterThread'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('delayAfterThread'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('delayAfterThread'))
  delayAfterThread: string;

  @IsString(LOCALE.validators['isString']('delayAfterReply'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('delayAfterReply'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('delayAfterReply'))
  delayAfterReply: string;

  @IsString(LOCALE.validators['isString']('minFileSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('minFileSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('minFileSize'))
  minFileSize: string;

  @IsString(LOCALE.validators['isString']('maxFileSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxFileSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxFileSize'))
  maxFileSize: string;

  @IsString(LOCALE.validators['isString']('allowMarkdown'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('allowMarkdown', 2))
  allowMarkdown: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('allowTripcodes'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('allowTripcodes', 2))
  allowTripcodes: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('maxThreadsOnBoard'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxThreadsOnBoard'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxThreadsOnBoard'))
  maxThreadsOnBoard: string;

  @IsString(LOCALE.validators['isString']('bumpLimit'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('bumpLimit'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('bumpLimit'))
  bumpLimit: string;

  @IsString(LOCALE.validators['isString']('maxStringFieldSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxStringFieldSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxStringFieldSize'))
  maxStringFieldSize: string;

  @IsString(LOCALE.validators['isString']('maxCommentSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxCommentSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxCommentSize'))
  maxCommentSize: string;

  @IsString(LOCALE.validators['isString']('maxThreadLivingTime'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxThreadLivingTime'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxThreadLivingTime'))
  maxThreadLivingTime: string;

  @IsString(LOCALE.validators['isString']('defaultPosterName'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('defaultPosterName'))
  @MinLength(3, LOCALE.validators['minLength']('defaultPosterName', 3))
  @MaxLength(128, LOCALE.validators['maxLength']('defaultPosterName', 128))
  defaultPosterName: string;

  @IsString(LOCALE.validators['isString']('defaultModeratorName'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('defaultModeratorName'))
  @MinLength(3, LOCALE.validators['minLength']('defaultModeratorName', 3))
  @MaxLength(128, LOCALE.validators['maxLength']('defaultModeratorName', 128))
  defaultModeratorName: string;

  @IsString(LOCALE.validators['isString']('enableCaptcha'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('enableCaptcha', 2))
  enableCaptcha: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('isCaptchaCaseSensitive'))
  @IsOptional()
  @MaxLength(2, LOCALE.validators['maxLength']('isCaptchaCaseSensitive', 2))
  isCaptchaCaseSensitive: 'on' | undefined;

  @IsString(LOCALE.validators['isString']('rules'))
  @IsOptional()
  @MaxLength(2048, LOCALE.validators['maxLength']('defaultModeratorName', 2048))
  rules: string;

  @IsOptional()
  allowedFileTypes?: string | string[];

  public toCreateInput(): Prisma.BoardCreateInput {
    return {
      slug: this.slug,
      name: this.name,
      visible: normalizeBoolean(this.visible),
      description: this.description,
      boardSettings: {
        create: {
          allowPosting: normalizeBoolean(this.allowPosting),
          strictAnonymity: normalizeBoolean(this.strictAnonymity),
          threadFileAttachmentMode: this.threadFileAttachmentMode,
          replyFileAttachmentMode: this.replyFileAttachmentMode,
          delayAfterThread: normalizeInteger(this.delayAfterThread, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          delayAfterReply: normalizeInteger(this.delayAfterReply, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          minFileSize: normalizeInteger(this.minFileSize, { min: 0, max: 19922944 }),
          maxFileSize: normalizeInteger(this.maxFileSize, { min: 0, max: 19922944 }),
          allowMarkdown: normalizeBoolean(this.allowMarkdown),
          allowTripcodes: normalizeBoolean(this.allowTripcodes),
          maxThreadsOnBoard: normalizeInteger(this.maxThreadsOnBoard, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          bumpLimit: normalizeInteger(this.bumpLimit, { min: 0, max: Number.MAX_SAFE_INTEGER }),
          maxStringFieldSize: normalizeInteger(this.maxStringFieldSize, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          maxCommentSize: normalizeInteger(this.maxCommentSize, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          maxThreadLivingTime: normalizeInteger(this.maxThreadLivingTime, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          defaultPosterName: this.defaultPosterName,
          defaultModeratorName: this.defaultModeratorName,
          enableCaptcha: normalizeBoolean(this.enableCaptcha),
          isCaptchaCaseSensitive: normalizeBoolean(this.isCaptchaCaseSensitive),
          rules: this.rules,
          allowedFileTypes: this.mapAllowedFileTypes(this.allowedFileTypes)
        }
      }
    };
  }

  public toString(): string {
    return `BoardCreateDto {
      slug: ${this.slug},
      name: ${this.name},
      visible: ${this.visible},
      description: ${this.description},
      allowPosting: ${this.allowPosting},
      strictAnonymity: ${this.strictAnonymity},
      threadFileAttachmentMode: ${this.threadFileAttachmentMode},
      replyFileAttachmentMode: ${this.replyFileAttachmentMode},
      delayAfterThread: ${this.delayAfterThread},
      delayAfterReply: ${this.delayAfterReply},
      minFileSize: ${this.minFileSize},
      maxFileSize: ${this.maxFileSize},
      allowMarkdown: ${this.allowMarkdown},
      allowTripcodes: ${this.allowTripcodes},
      maxThreadsOnBoard: ${this.maxThreadsOnBoard},
      bumpLimit: ${this.bumpLimit},
      maxStringFieldSize: ${this.maxStringFieldSize},
      maxCommentSize: ${this.maxCommentSize},
      maxThreadLivingTime: ${this.maxThreadLivingTime},
      defaultPosterName: ${this.defaultPosterName},
      defaultModeratorName: ${this.defaultModeratorName},
      enableCaptcha: ${this.enableCaptcha},
      isCaptchaCaseSensitive: ${this.isCaptchaCaseSensitive},
      rules: ${this.rules},
      allowedFileTypes: ${this.allowedFileTypes}
    }`;
  }

  private mapAllowedFileTypes(allowedFileTypes: string[] | string): string {
    if (allowedFileTypes) {
      if (Array.isArray(allowedFileTypes)) {
        return JSON.stringify([allowedFileTypes]);
      }

      return JSON.stringify([[allowedFileTypes]]);
    }

    return '[[]]';
  }
}
