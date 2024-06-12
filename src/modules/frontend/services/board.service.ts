/* eslint-disable prettier/prettier  */
import { Injectable } from '@nestjs/common';
import { BoardService as BackendBoardService } from '@backend/services/board.service';
import { BoardPage } from '@frontend/pages';
import { PaginationResolveService, CaptchaService } from '@utils/services';
import { CommentService as BackendCommentService, CommentsQueries } from '@backend/services';
import { OmittedPostsDto, ThreadDto } from '@frontend/dto';
import { PrismaTakeSkipDto, validateNotEmptyPage } from '@utils/misc';
import { CommentDto } from '@backend/dto/comment';
import { Prisma } from '@prisma/client';
import { setPasswordFromCookies } from '@frontend/utils';
import { ConfigService } from '@nestjs/config';
import { reverse } from 'lodash';
import { SessionDto } from '@admin/dto';
import { CommentPageMode } from '@frontend/enums';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardService: BackendBoardService,
    private readonly commentService: BackendCommentService,
    private readonly commentQueries: CommentsQueries,
    private readonly paginationResolve: PaginationResolveService,
    private readonly config: ConfigService,
    private readonly captchaService: CaptchaService
  ) {}

  public async getBoardPage(slug: string, cookies: Record<string, unknown>, session?: SessionDto, page = 0): Promise<BoardPage> {
    const board = await this.boardService.findBySlug(slug);
    const boards = await this.boardService.findAll({ visible: true }, null, { slug: 'asc' });

    const threadSearchCondition: Prisma.CommentWhereInput = { board: { slug }, lastHit: { not: null } };

    const threads = await this.commentQueries.findAll(
      threadSearchCondition, this.paginationResolve.resolveThreadSelection(page), { lastHit: 'desc' }
    );

    validateNotEmptyPage(threads, page);

    const threadDtoList = await this.mapThreadsToDto(threads);

    return BoardPage
      .builder()
      .maxPage(await this.commentQueries.getMaxPageNumber(threadSearchCondition))
      .currentPage(page)
      .session(session.payload ?? null)
      .pageMode(CommentPageMode.BOARD)
      .board(board)
      .boards(boards)
      .password(this.setPassword(cookies))
      .threads(threadDtoList)
      .captcha(this.captchaService.generateCaptcha())
      .build();
  }

  private async mapThreadsToDto(threads: CommentDto[]): Promise<ThreadDto[]> {
    const threadDtoList: ThreadDto[] = [];

    for (const thread of threads) {
      const lastRepliesCount = this.config.getOrThrow<number>('constants.pagination.default.preview-replies');
      const repliesSearchCondition: Prisma.CommentWhereInput = { parent: { board: { slug: thread.boardSlug }, displayNumber: thread.displayNumber } };
      const repliesOrderBy: Prisma.CommentOrderByWithRelationInput = { createdAt: 'desc' };

      const replies = await this.commentQueries.findAll(repliesSearchCondition, new PrismaTakeSkipDto(lastRepliesCount, 0), repliesOrderBy);

      const mappedThread = new ThreadDto(thread, reverse(replies), await this.calculateOmittedPosts(lastRepliesCount, thread, replies));
      threadDtoList.push(mappedThread);
    }

    return threadDtoList;
  }

  private setPassword(cookies: Record<string, unknown>): string {
    return setPasswordFromCookies(cookies);
  }

  private async calculateOmittedPosts(lastRepliesCount: number, thread: CommentDto, displayReplies: CommentDto[]): Promise<OmittedPostsDto> {
    const allRepliesCount = await this.commentQueries.count({ parent: { board: { slug: thread.boardSlug }, displayNumber: thread.displayNumber } });
    const allImagesCount = await this.commentQueries.count(
      { parent: { board: { slug: thread.boardSlug }, displayNumber: thread.displayNumber }, attachedFile: { isNot: null } });

    const previewImagesCount = displayReplies.filter(reply => reply.attachedFile !== undefined).length;

    const omittedPosts = allRepliesCount - lastRepliesCount;
    const omittedImages = allImagesCount - previewImagesCount;

    return new OmittedPostsDto(this.makePositiveNumber(omittedPosts), this.makePositiveNumber(omittedImages), allRepliesCount > lastRepliesCount);
  }

  private makePositiveNumber(num: number): number {
    if (num <= 0) {
      return 0;
    }

    return num;
  }
}
