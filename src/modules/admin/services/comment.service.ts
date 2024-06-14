import { BadRequestException, Injectable } from '@nestjs/common';
import { AttachedFileService, BoardService, CommentService as BackendCommentService, CommentsQueries } from '@backend/services';
import { RemoveCommentDto, RemoveCommentMode, SessionPayloadDto } from '@admin/dto';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaTakeSkipDto } from '@utils/misc';
import { CommentListPage } from '@admin/pages';
import { PaginationResolveService } from '@utils/services';

@Injectable()
export class CommentService {
  constructor(
    private readonly paginationResolve: PaginationResolveService,
    private readonly commentService: BackendCommentService,
    private readonly commentQueries: CommentsQueries,
    private readonly boardService: BoardService,
    private readonly attachedFileService: AttachedFileService
  ) {}

  public async findList(session: SessionPayloadDto, slug?: string, page = 0): Promise<CommentListPage> {
    const normalizedSlug = slug ?? '';

    const boards = await this.boardService.findAll({}, new PrismaTakeSkipDto(), { slug: 'asc' });
    const commentSearchCondition: Prisma.CommentWhereInput = { board: { slug: normalizedSlug } };
    const comments = await this.commentQueries.findAll(commentSearchCondition, this.paginationResolve.resolveTableSelection(page), {
      createdAt: 'desc'
    });

    return {
      session,
      currentPage: page,
      maxPage: await this.commentQueries.getMaxPageNumber(commentSearchCondition),
      comments,
      currentBoard: boards.find(value => value.slug === slug),
      allBoards: boards
    };
  }

  public async removeComment(dto: RemoveCommentDto, res: Response): Promise<void> {
    if (dto.mode === RemoveCommentMode.ONLY_COMMENT) {
      await this.removeOnlyComment(dto);
    } else if (dto.mode === RemoveCommentMode.ONLY_FILE) {
      await this.removeOnlyFile(dto);
    } else if (dto.mode === RemoveCommentMode.ALL_BY_IP) {
      await this.removeAllByIp(dto);
    } else {
      throw new BadRequestException(`Unknown deletion option: ${dto.mode}`);
    }

    res.redirect(dto.redirectAfterDeletion);
  }

  private async removeOnlyComment(dto: RemoveCommentDto): Promise<void> {
    const removeCondition: Prisma.CommentWhereInput = { id: dto.commentId };

    await this.commentService.remove(removeCondition);
  }

  private async removeOnlyFile(dto: RemoveCommentDto): Promise<void> {
    const removeCondition: Prisma.AttachedFileWhereInput = { commentId: dto.commentId };

    await this.attachedFileService.remove(removeCondition);
  }

  private async removeAllByIp(dto: RemoveCommentDto): Promise<void> {
    const commentsWhereInput: Prisma.CommentWhereInput = { ip: dto.ip };

    const commentsCandidateDeletion = await this.commentQueries.findAll(commentsWhereInput, new PrismaTakeSkipDto());

    for (const comment of commentsCandidateDeletion) {
      if (comment.attachedFile) {
        await this.attachedFileService.remove({ id: comment.attachedFile.id });
      }

      await this.commentService.remove({ id: comment.id });
    }
  }
}
