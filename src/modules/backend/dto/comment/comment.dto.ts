import { AttachedFile, Comment } from '@prisma/client';
import { DateTime } from 'luxon';
import { AttachedFileDto } from '@backend/dto/comment/attached-file.dto';
import { LOCALE } from '@utils/locale';

export class CommentDto {
  id: string;

  createdAt: string;

  boardSlug: string;

  parentNumber?: number;

  displayNumber: number;

  isAdmin: boolean;

  ip: string;

  name: string;

  options: string;

  subject: string;

  comment: string;

  attachedFile?: AttachedFileDto;

  tripcode?: string;

  constructor(
    id: string,
    createdAt: string,
    boardSlug: string,
    displayNumber: number,
    isAdmin: boolean,
    ip: string,
    name: string,
    options: string,
    subject: string,
    comment: string,
    attachedFile?: AttachedFileDto,
    parentNumber?: number,
    tripcode?: string
  ) {
    this.id = id;
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

    this.parentNumber = parentNumber ?? null;
    this.tripcode = tripcode ?? null;
  }

  public static fromModel(model: Comment, boardSlug: string, attachedFile?: AttachedFile): CommentDto {
    return new CommentDto(
      model.id,
      DateTime.fromJSDate(model.createdAt).toFormat('EEE dd MMM yyyy HH:mm:ss', { locale: LOCALE.luxon as string }),
      boardSlug,
      model.displayNumber,
      model.isAdmin,
      model.ip,
      model.name,
      model.options,
      model.subject,
      model.comment,
      AttachedFileDto.fromModel(attachedFile),
      model['parent'] ? model['parent'].displayNumber : null,
      model.tripcode
    );
  }
}
