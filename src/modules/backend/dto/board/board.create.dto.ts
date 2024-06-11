import { FileAttachmentMode, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeBoolean, normalizeInteger } from '@utils/misc';

export class BoardCreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  visible: 'on' | undefined;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1024)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  allowPosting: 'on' | undefined;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  strictAnonymity: 'on' | undefined;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FileAttachmentMode)
  threadFileAttachmentMode: FileAttachmentMode;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FileAttachmentMode)
  replyFileAttachmentMode: FileAttachmentMode;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  delayAfterThread: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  delayAfterReply: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  minFileSize: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxFileSize: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  allowMarkdown: 'on' | undefined;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxThreadsOnBoard: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  bumpLimit: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxStringFieldSize: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxCommentSize: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxThreadLivingTime: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  defaultPosterName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  defaultModeratorName: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  rules: string;

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
          maxThreadsOnBoard: normalizeInteger(this.maxThreadsOnBoard, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          bumpLimit: normalizeInteger(this.bumpLimit, { min: 0, max: Number.MAX_SAFE_INTEGER }),
          maxStringFieldSize: normalizeInteger(this.maxStringFieldSize, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          maxCommentSize: normalizeInteger(this.maxCommentSize, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          maxThreadLivingTime: normalizeInteger(this.maxThreadLivingTime, { min: 0, max: Number.MAX_SAFE_INTEGER - 1 }),
          defaultPosterName: this.defaultPosterName,
          defaultModeratorName: this.defaultModeratorName,
          rules: this.rules
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
      maxThreadsOnBoard: ${this.maxThreadsOnBoard},
      bumpLimit: ${this.bumpLimit},
      maxStringFieldSize: ${this.maxStringFieldSize},
      maxCommentSize: ${this.maxCommentSize},
      maxThreadLivingTime: ${this.maxThreadLivingTime},
      defaultPosterName: ${this.defaultPosterName},
      defaultModeratorName: ${this.defaultModeratorName},
      rules: ${this.rules}
    }`;
  }
}
