import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentService as BackendCommentService, CommentsQueries } from '@backend/services';
import { CommentCreateDto } from '@backend/dto/comment';
import { Response } from 'express';
import { CommentRemoveDto } from '@frontend/dto';
import { Prisma } from '@prisma/client';
import { SessionDto } from '@admin/dto';
import { LOCALE } from '@utils/locale';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentService: BackendCommentService,
    private readonly commentQueries: CommentsQueries
  ) {}

  public async createThread(board: string, ip: string, dto: CommentCreateDto, res: Response, session: SessionDto): Promise<void> {
    this.validateSession(dto, session);

    const comment = await this.commentService.createThread(board, ip, dto, this.parseBooleanCheckbox(dto.isAdmin));

    this.setPasswordAndName(dto, res);
    res.redirect(`/${board}/res/${comment.displayNumber}#${comment.displayNumber}`);
  }

  public async createReply(
    board: string,
    displayNumber: number,
    ip: string,
    dto: CommentCreateDto,
    res: Response,
    session: SessionDto
  ): Promise<void> {
    this.validateSession(dto, session);

    const comment = await this.commentService.createReply(board, displayNumber, ip, dto, this.parseBooleanCheckbox(dto.isAdmin));

    this.setPasswordAndName(dto, res);
    res.redirect(`/${board}/res/${displayNumber}#${comment.displayNumber}`);
  }

  public async removeAndRedirectToBoard(board: string, dto: CommentRemoveDto, res: Response): Promise<void> {
    await this.remove(board, dto);

    res.redirect(`/${board}`);
  }

  public async removeAndRedirectToThread(board: string, displayNumber: number, dto: CommentRemoveDto, res: Response): Promise<void> {
    await this.remove(board, dto);

    if (await this.commentQueries.existsByBoardAndDisplayNumber(board, displayNumber)) {
      res.redirect(`/${board}/res/${displayNumber}`);
    } else {
      res.redirect(`/${board}`);
    }
  }

  private async remove(board: string, dto: CommentRemoveDto): Promise<void> {
    const commentSearchConditions: Prisma.CommentWhereInput = { board: { slug: board }, displayNumber: { in: dto.delete }, password: dto.password };

    if (dto.fileOnly) {
      await this.commentService.clearAttachedFile(commentSearchConditions);
    } else {
      await this.commentService.remove(commentSearchConditions);
    }
  }

  private setPasswordAndName(dto: CommentCreateDto, res: Response): void {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    res.cookie('torichanPass', dto.password, { expires: expirationDate });

    if (dto.name) {
      res.cookie('torichan_name', dto.name, { expires: expirationDate });
    } else {
      res.clearCookie('torichan_name');
    }
  }

  private validateSession(dto: CommentCreateDto, session: SessionDto): void {
    if (dto.isAdmin === 'on' && !session.payload) {
      throw new BadRequestException(LOCALE.frontend['youCannotWriteCommentWithoutSignIn']);
    }
  }

  private parseBooleanCheckbox(val: 'on' | undefined): boolean {
    return val === 'on';
  }
}
