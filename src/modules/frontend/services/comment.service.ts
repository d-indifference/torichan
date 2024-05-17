import { Injectable } from '@nestjs/common';
import { CommentService as BackendCommentService } from '@backend/services';
import { CommentCreateDto } from '@backend/dto/comment';
import { Response } from 'express';

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

  private setPassword(dto: CommentCreateDto, res: Response): void {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 365 * 24 * 60 * 60 * 1000);

    res.cookie('torichanPass', dto.password, { expires: expirationDate });
  }
}
