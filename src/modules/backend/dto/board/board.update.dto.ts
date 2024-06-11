import { Board, BoardSettings, FileAttachmentMode, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeBoolean, normalizeInteger } from '@utils/misc';

export class BoardUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  visible?: 'on' | undefined;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1024)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  allowPosting?: 'on' | undefined;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  strictAnonymity?: 'on' | undefined;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FileAttachmentMode)
  threadFileAttachmentMode?: FileAttachmentMode;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FileAttachmentMode)
  replyFileAttachmentMode?: FileAttachmentMode;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  delayAfterThread?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  delayAfterReply?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  minFileSize?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxFileSize?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  allowMarkdown?: 'on' | undefined;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxThreadsOnBoard?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  bumpLimit?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxStringFieldSize?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxCommentSize?: string;

  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  maxThreadLivingTime?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  defaultPosterName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  defaultModeratorName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  enableCaptcha: 'on' | undefined;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  rules?: string;

  public toUpdateInput(id: string): Prisma.BoardUpdateInput {
    const inputBoard: Record<string, unknown> = {};
    const inputBoardSettings: Record<string, unknown> = {};

    this.setFieldToInputTemplate(inputBoard, 'slug');
    this.setFieldToInputTemplate(inputBoard, 'name');
    this.setBooleanFieldToInputTemplate(inputBoard, 'visible');
    this.setFieldToInputTemplate(inputBoard, 'description');

    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'allowPosting');
    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'strictAnonymity');
    this.setFieldToInputTemplate(inputBoardSettings, 'threadFileAttachmentMode');
    this.setFieldToInputTemplate(inputBoardSettings, 'replyFileAttachmentMode');
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'delayAfterThread', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'delayAfterReply', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'minFileSize', { min: 0, max: 19922944 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxFileSize', { min: 0, max: 19922944 });
    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'allowMarkdown');
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxThreadsOnBoard', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'bumpLimit', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxStringFieldSize', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxCommentSize', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxThreadLivingTime', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setFieldToInputTemplate(inputBoardSettings, 'defaultPosterName');
    this.setFieldToInputTemplate(inputBoardSettings, 'defaultModeratorName');
    this.setFieldToInputTemplate(inputBoardSettings, 'rules');
    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'enableCaptcha');

    const prismaInputBoardSettings: Prisma.BoardSettingsUpdateInput = inputBoardSettings as Prisma.BoardSettingsUpdateInput;
    const prismaInputBoard: Prisma.BoardUpdateInput = inputBoard as Prisma.BoardUpdateInput;

    prismaInputBoard.boardSettings = { update: { where: { id }, data: prismaInputBoardSettings } };

    return prismaInputBoard;
  }

  public static fromModel(board: Board): BoardUpdateDto {
    const boardSettings: BoardSettings = board['boardSettings'];

    const dto = new BoardUpdateDto();
    dto.slug = board.slug;
    dto.name = board.name;
    dto.visible = board.visible ? 'on' : null;
    dto.description = board.description;
    dto.allowPosting = boardSettings.allowPosting ? 'on' : null;
    dto.strictAnonymity = boardSettings.strictAnonymity ? 'on' : null;
    dto.threadFileAttachmentMode = boardSettings.threadFileAttachmentMode;
    dto.replyFileAttachmentMode = boardSettings.replyFileAttachmentMode;
    dto.delayAfterThread = boardSettings.delayAfterThread.toString();
    dto.delayAfterReply = boardSettings.delayAfterReply.toString();
    dto.minFileSize = boardSettings.minFileSize.toString();
    dto.maxFileSize = boardSettings.maxFileSize.toString();
    dto.allowMarkdown = boardSettings.allowMarkdown ? 'on' : null;
    dto.maxThreadsOnBoard = boardSettings.maxThreadsOnBoard.toString();
    dto.bumpLimit = boardSettings.bumpLimit.toString();
    dto.maxStringFieldSize = boardSettings.maxStringFieldSize.toString();
    dto.maxCommentSize = boardSettings.maxCommentSize.toString();
    dto.maxThreadLivingTime = boardSettings.maxThreadLivingTime.toString();
    dto.defaultPosterName = boardSettings.defaultPosterName;
    dto.defaultModeratorName = boardSettings.defaultModeratorName;
    dto.enableCaptcha = boardSettings.enableCaptcha ? 'on' : null;
    dto.rules = boardSettings.rules;

    return dto;
  }

  public toString(): string {
    return `BoardUpdateDto {
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
      enableCaptcha: ${this.enableCaptcha}
      rules: ${this.rules}
    }`;
  }

  private setIntegerFieldToInputTemplate(input: Record<string, unknown>, fieldName: string, options?: { min: number; max: number }): void {
    if (this[fieldName]) {
      input[fieldName] = normalizeInteger(this[fieldName], options);
    }
  }

  private setBooleanFieldToInputTemplate(input: Record<string, unknown>, fieldName: string): void {
    if (this[fieldName]) {
      input[fieldName] = normalizeBoolean(this[fieldName]);
    } else {
      input[fieldName] = false;
    }
  }

  private setFieldToInputTemplate(input: Record<string, unknown>, fieldName: string): void {
    if (this[fieldName]) {
      input[fieldName] = this[fieldName];
    }
  }
}
