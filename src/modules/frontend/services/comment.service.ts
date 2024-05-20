import { Injectable } from '@nestjs/common';
import { CommentService as BackendCommentService } from '@backend/services';
import { CommentCreateDto } from '@backend/dto/comment';
import { Response } from 'express';
import { CommentRemoveDto } from '@frontend/dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly commentService: BackendCommentService) {}

  public async createThread(board: string, ip: string, dto: CommentCreateDto, res: Response): Promise<void> {
    const comment = await this.commentService.createThread(board, ip, dto);

    this.setPassword(dto, res);
    res.redirect(`/${board}/res/${comment.displayNumber}#${comment.displayNumber}`);
  }

  public async createReply(board: string, displayNumber: number, ip: string, dto: CommentCreateDto, res: Response): Promise<void> {
    const comment = await this.commentService.createReply(board, displayNumber, ip, dto);

    this.setPassword(dto, res);
    res.redirect(`/${board}/res/${displayNumber}#${comment.displayNumber}`);
  }

  public async removeAndRedirectToBoard(board: string, dto: CommentRemoveDto, res: Response): Promise<void> {
    await this.remove(board, dto);

    res.redirect(`/${board}`);
  }

  public async removeAndRedirectToThread(board: string, displayNumber: number, dto: CommentRemoveDto, res: Response): Promise<void> {
    await this.remove(board, dto);

    if (await this.commentService.existsByBoardAndDisplayNumber(board, displayNumber)) {
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

  private setPassword(dto: CommentCreateDto, res: Response): void {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    res.cookie('torichanPass', dto.password, { expires: expirationDate });
  }
}
