import { Board, BoardSettings, FileAttachmentMode, Prisma } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { normalizeBoolean, normalizeInteger } from '@utils/misc';
import { LOCALE } from '@utils/locale';

export class BoardUpdateDto {
  @IsOptional()
  @IsString(LOCALE.validators['isString']('slug'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('slug'))
  @MaxLength(256, LOCALE.validators['maxLength']('slug', 256))
  slug?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('name'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('name'))
  @MaxLength(256, LOCALE.validators['maxLength']('name', 256))
  name?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('visible'))
  @MaxLength(2, LOCALE.validators['maxLength']('visible', 2))
  visible?: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('description'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('description'))
  @MinLength(3, LOCALE.validators['minLength']('description', 3))
  @MaxLength(1024, LOCALE.validators['maxLength']('description', 1024))
  description?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('allowPosting'))
  @MaxLength(2, LOCALE.validators['maxLength']('allowPosting', 2))
  allowPosting?: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('strictAnonymity'))
  @MaxLength(2, LOCALE.validators['maxLength']('strictAnonymity', 2))
  strictAnonymity?: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('threadFileAttachmentMode'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('threadFileAttachmentMode'))
  @IsEnum(FileAttachmentMode, LOCALE.validators['isEnum']('threadFileAttachmentMode'))
  threadFileAttachmentMode?: FileAttachmentMode;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('replyFileAttachmentMode'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('replyFileAttachmentMode'))
  @IsEnum(FileAttachmentMode, LOCALE.validators['isEnum']('replyFileAttachmentMode'))
  replyFileAttachmentMode?: FileAttachmentMode;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('delayAfterThread'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('delayAfterThread'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('delayAfterThread'))
  delayAfterThread?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('delayAfterReply'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('delayAfterReply'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('delayAfterReply'))
  delayAfterReply?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('minFileSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('minFileSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('minFileSize'))
  minFileSize?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('maxFileSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxFileSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxFileSize'))
  maxFileSize?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('allowMarkdown'))
  @MaxLength(2, LOCALE.validators['maxLength']('allowMarkdown', 2))
  allowMarkdown?: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('allowTripcodes'))
  @MaxLength(2, LOCALE.validators['maxLength']('allowTripcodes', 2))
  allowTripcodes?: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('maxThreadsOnBoard'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxThreadsOnBoard'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxThreadsOnBoard'))
  maxThreadsOnBoard?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('bumpLimit'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('bumpLimit'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('bumpLimit'))
  bumpLimit?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('maxStringFieldSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxStringFieldSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxStringFieldSize'))
  maxStringFieldSize?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('maxCommentSize'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxCommentSize'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxCommentSize'))
  maxCommentSize?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('maxThreadLivingTime'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('maxThreadLivingTime'))
  @IsNumberString(null, LOCALE.validators['isNumberString']('maxThreadLivingTime'))
  maxThreadLivingTime?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('defaultPosterName'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('defaultPosterName'))
  @MinLength(3, LOCALE.validators['minLength']('defaultPosterName', 3))
  @MaxLength(128, LOCALE.validators['maxLength']('defaultPosterName', 128))
  defaultPosterName?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('defaultModeratorName'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('defaultModeratorName'))
  @MinLength(3, LOCALE.validators['minLength']('defaultModeratorName', 3))
  @MaxLength(128, LOCALE.validators['maxLength']('defaultModeratorName', 128))
  defaultModeratorName?: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('enableCaptcha'))
  @MaxLength(2, LOCALE.validators['maxLength']('enableCaptcha', 2))
  enableCaptcha: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('isCaptchaCaseSensitive'))
  @MaxLength(2, LOCALE.validators['maxLength']('isCaptchaCaseSensitive', 2))
  isCaptchaCaseSensitive: 'on' | undefined;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('rules'))
  @MaxLength(2048, LOCALE.validators['maxLength']('defaultModeratorName', 2048))
  rules?: string;

  @IsOptional()
  allowedFileTypes?: string | string[];

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
    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'allowTripcodes');
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxThreadsOnBoard', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'bumpLimit', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxStringFieldSize', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxCommentSize', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setIntegerFieldToInputTemplate(inputBoardSettings, 'maxThreadLivingTime', { min: 0, max: Number.MAX_SAFE_INTEGER - 1 });
    this.setFieldToInputTemplate(inputBoardSettings, 'defaultPosterName');
    this.setFieldToInputTemplate(inputBoardSettings, 'defaultModeratorName');
    this.setFieldToInputTemplate(inputBoardSettings, 'rules');
    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'enableCaptcha');
    this.setBooleanFieldToInputTemplate(inputBoardSettings, 'isCaptchaCaseSensitive');
    this.normalizeCheckboxArray(inputBoardSettings, 'allowedFileTypes');

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
    dto.allowTripcodes = boardSettings.allowTripcodes ? 'on' : null;
    dto.maxThreadsOnBoard = boardSettings.maxThreadsOnBoard.toString();
    dto.bumpLimit = boardSettings.bumpLimit.toString();
    dto.maxStringFieldSize = boardSettings.maxStringFieldSize.toString();
    dto.maxCommentSize = boardSettings.maxCommentSize.toString();
    dto.maxThreadLivingTime = boardSettings.maxThreadLivingTime.toString();
    dto.defaultPosterName = boardSettings.defaultPosterName;
    dto.defaultModeratorName = boardSettings.defaultModeratorName;
    dto.enableCaptcha = boardSettings.enableCaptcha ? 'on' : null;
    dto.isCaptchaCaseSensitive = boardSettings.isCaptchaCaseSensitive ? 'on' : null;
    dto.rules = boardSettings.rules;
    dto.allowedFileTypes = boardSettings.allowedFileTypes as string[];

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

  private normalizeCheckboxArray(input: Record<string, unknown>, fieldName: string): void {
    const inputValue = this[fieldName];

    if (input) {
      if (Array.isArray(input)) {
        input[fieldName] = JSON.stringify(inputValue);
      } else {
        input[fieldName] = JSON.stringify([inputValue]);
      }
    }
  }
}
