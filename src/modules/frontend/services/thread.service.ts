/* eslint-disable prettier/prettier  */
import { Injectable } from '@nestjs/common';
import { BoardService as BackendBoardService, CommentService as BackendCommentService } from '@backend/services';
import { ThreadPage } from '@frontend/pages';
import { setPasswordFromCookies } from '@frontend/utils';
import { Prisma } from '@prisma/client';
import { CommentDto } from '@backend/dto/comment';
import { ThreadDto } from '@frontend/dto';

@Injectable()
export class ThreadService {
  constructor(
    private readonly boardService: BackendBoardService,
    private readonly commentService: BackendCommentService
  ) {}

  public async getThreadPage(slug: string, displayNumber: number, cookies: Record<string, unknown>): Promise<ThreadPage> {
    const board = await this.boardService.findBySlug(slug);

    const threadSearchCondition: Prisma.CommentWhereInput = { displayNumber, board: { slug } };

    const thread = await this.commentService.findOne(threadSearchCondition);

    return ThreadPage
      .builder()
      .board(board)
      .thread(await this.mapThread(thread))
      .password(this.setPassword(cookies))
      .build();
  }

  private setPassword(cookies: Record<string, unknown>): string {
    return setPasswordFromCookies(cookies);
  }

  private async mapThread(openingPost: CommentDto): Promise<ThreadDto> {
    const repliesSearchCondition: Prisma.CommentWhereInput =
      { parent: { board: { slug: openingPost.boardSlug }, displayNumber: openingPost.displayNumber } };

    const replies = await this.commentService.findAll(repliesSearchCondition, {}, { createdAt: 'asc' });

    return new ThreadDto(openingPost, replies);
  }
}
