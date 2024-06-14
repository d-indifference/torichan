import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaTakeSkipDto } from '@utils/misc';
import { CommentDto } from '@backend/dto/comment';
import { PrismaService } from '@utils/services';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentsQueries {
  private readonly logger: Logger = new Logger(CommentsQueries.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

  public async findAll(
    where: Prisma.CommentWhereInput,
    selection?: PrismaTakeSkipDto,
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[]
  ): Promise<CommentDto[]> {
    this.logger.log(`findAll ({where: ${JSON.stringify(where)}, selection: ${selection.toString()}, orderBy: ${JSON.stringify(orderBy)}})`);

    const comments = await this.prisma.comment.findMany({
      where,
      ...selection,
      orderBy,
      include: { board: true, attachedFile: true, children: true, parent: true }
    });

    return comments.map(comment => CommentDto.fromModel(comment, comment.board.slug, comment.attachedFile));
  }

  public async count(where: Prisma.CommentWhereInput, needToLog?: boolean): Promise<number> {
    if (needToLog) {
      this.logger.log(`count ({where: ${JSON.stringify(where)}})`);
    }

    return (await this.prisma.comment.count({ where })) as number;
  }

  public async findOne(where: Prisma.CommentWhereInput): Promise<CommentDto> {
    this.logger.log(`findOne ({where: ${JSON.stringify(where)}})`);

    const comment = await this.findOneEntity(where);

    return CommentDto.fromModel(comment, comment['board'].slug, comment['attachedFile']);
  }

  public async findOneEntity(where: Prisma.CommentWhereInput): Promise<Comment> {
    this.logger.log(`findOneEntity ({where: ${JSON.stringify(where)}})`);

    const comment = await this.prisma.comment.findFirst({ where, include: { board: true, attachedFile: true, children: true, parent: true } });

    if (!comment) {
      const message = 'Comment was not found';
      this.logger.warn(`${message}, params: ${JSON.stringify(where)}`);
      throw new NotFoundException(message);
    }

    return comment;
  }

  public async existsByBoardAndDisplayNumber(board: string, displayNumber: number): Promise<boolean> {
    const comment = await this.prisma.comment.findFirst({ include: { board: true }, where: { displayNumber, board: { slug: board } } });

    return comment !== null;
  }

  public async getMaxPageNumber(where: Prisma.CommentWhereInput, needToLog?: boolean): Promise<number> {
    if (needToLog) {
      this.logger.log(`getMaxPageNumber ({where: ${JSON.stringify(where)})`);
    }

    const pageSize = this.config.getOrThrow<number>('constants.pagination.default.threads');

    const count = await this.prisma.comment.count({ where });

    return Math.floor(count / pageSize);
  }
}
