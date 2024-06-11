import { Board, BoardSettings, FileAttachmentMode } from '@prisma/client';
import { filesize } from 'filesize';

export class BoardDto {
  id: string;

  slug: string;

  name: string;

  description: string;

  allowPosting: boolean;

  strictAnonymity: boolean;

  threadFileAttachmentMode: FileAttachmentMode;

  replyFileAttachmentMode: FileAttachmentMode;

  minFileSize: string;

  maxFileSize: string;

  enableCaptcha: boolean;

  rules: string;

  constructor(
    id: string,
    slug: string,
    name: string,
    description: string,
    allowPosting: boolean,
    strictAnonymity: boolean,
    threadFileAttachmentMode: FileAttachmentMode,
    replyFileAttachmentMode: FileAttachmentMode,
    minFileSize: string,
    maxFileSize: string,
    enableCaptcha: boolean,
    rules: string
  ) {
    this.id = id;
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.allowPosting = allowPosting;
    this.strictAnonymity = strictAnonymity;
    this.threadFileAttachmentMode = threadFileAttachmentMode;
    this.replyFileAttachmentMode = replyFileAttachmentMode;
    this.minFileSize = minFileSize;
    this.maxFileSize = maxFileSize;
    this.enableCaptcha = enableCaptcha;
    this.rules = rules;
  }

  public static fromModel(model: Board): BoardDto {
    const boardSettings: BoardSettings = model['boardSettings'];
    return new BoardDto(
      model.id,
      model.slug,
      model.name,
      model.description,
      boardSettings.allowPosting,
      boardSettings.strictAnonymity,
      boardSettings.threadFileAttachmentMode,
      boardSettings.replyFileAttachmentMode,
      filesize(boardSettings.minFileSize, { standard: 'jedec' }),
      filesize(boardSettings.maxFileSize, { standard: 'jedec' }),
      boardSettings.enableCaptcha,
      boardSettings.rules
    );
  }
}
