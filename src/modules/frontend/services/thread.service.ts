/* eslint-disable prettier/prettier  */
import { Injectable } from '@nestjs/common';
import {
  BoardService as BackendBoardService,
  CommentsQueries
} from '@backend/services';
import { ThreadPage } from '@frontend/pages';
import { setPasswordFromCookies } from '@frontend/utils';
import { Prisma } from '@prisma/client';
import { CommentDto } from '@backend/dto/comment';
import { ThreadDto } from '@frontend/dto';
import { SessionDto } from '@admin/dto';
import { CommentPageMode } from '@frontend/enums';
import { CaptchaService } from '@utils/services';

@Injectable()
export class ThreadService {
  constructor(
    private readonly boardService: BackendBoardService,
    private readonly commentQueries: CommentsQueries,
    private readonly captchaService: CaptchaService
  ) {}

  public async getThreadPage(slug: string, displayNumber: number, cookies: Record<string, unknown>, session?: SessionDto): Promise<ThreadPage> {
    const board = await this.boardService.findBySlug(slug);

    const threadSearchCondition: Prisma.CommentWhereInput = { displayNumber, board: { slug } };

    const thread = await this.commentQueries.findOne(threadSearchCondition);

    return ThreadPage
      .builder()
      .session(session.payload ?? null)
      .pageMode(CommentPageMode.THREAD)
      .board(board)
      .thread(await this.mapThread(thread))
      .password(this.setPassword(cookies))
      .captcha(this.captchaService.generateCaptcha())
      .build();
  }

  private setPassword(cookies: Record<string, unknown>): string {
    return setPasswordFromCookies(cookies);
  }

  private async mapThread(openingPost: CommentDto): Promise<ThreadDto> {
    const repliesSearchCondition: Prisma.CommentWhereInput =
      { parent: { board: { slug: openingPost.boardSlug }, displayNumber: openingPost.displayNumber } };

    const replies = await this.commentQueries.findAll(repliesSearchCondition, {}, { createdAt: 'asc' });

    return new ThreadDto(openingPost, replies);
  }
}
