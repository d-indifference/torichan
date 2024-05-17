import { AttachedFile, Comment } from '@prisma/client';
import { DateTime } from 'luxon';
import { AttachedFileDto } from '@backend/dto/comment/attached-file.dto';

export class CommentDto {
  createdAt: string;

  boardSlug: string;

  displayNumber: number;

  isAdmin: boolean;

  ip: string;

  name: string;

  options: string;

  subject: string;

  comment: string;

  attachedFile?: AttachedFileDto;

  constructor(
    createdAt: string,
    boardSlug: string,
    displayNumber: number,
    isAdmin: boolean,
    ip: string,
    name: string,
    options: string,
    subject: string,
    comment: string,
    attachedFile?: AttachedFileDto
  ) {
    this.createdAt = createdAt;
    this.boardSlug = boardSlug;
    this.displayNumber = displayNumber;
    this.isAdmin = isAdmin;
    this.ip = ip;
    this.name = name;
    this.options = options;
    this.subject = subject;
    this.comment = comment;

    if (attachedFile) {
      this.attachedFile = attachedFile;
    }
  }

  public static fromModel(model: Comment, boardSlug: string, attachedFile?: AttachedFile): CommentDto {
    return new CommentDto(
      DateTime.fromJSDate(model.createdAt).toFormat('EEE dd MMM yyyy HH:mm:ss'),
      boardSlug,
      model.displayNumber,
      model.isAdmin,
      model.ip,
      model.name,
      model.options,
      model.subject,
      model.comment,
      AttachedFileDto.fromModel(attachedFile)
    );
  }
}
