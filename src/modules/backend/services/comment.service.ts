/* eslint-disable prettier/prettier  */
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { Comment, Prisma } from '@prisma/client';
import { CommentCreateDto, CommentDto } from '@backend/dto/comment';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { BoardService } from '@backend/services/board.service';
import { AttachedFileService } from '@backend/services/attached-file.service';
import { PrismaTakeSkipDto } from '@utils/misc';

@Injectable()
export class CommentService {
  private readonly logger: Logger = new Logger(CommentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly boardService: BoardService,
    private readonly attachedFileService: AttachedFileService
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

  public async count(where: Prisma.CommentWhereInput): Promise<number> {
    this.logger.log(`count ({where: ${JSON.stringify(where)}})`);

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

  public async getMaxPageNumber(where: Prisma.CommentWhereInput): Promise<number> {
    const pageSize = this.config.getOrThrow<number>('constants.pagination.default.threads');

    const count = await this.prisma.comment.count({ where });

    return Math.round(count / pageSize);
  }

  public async createThread(board: string, ip: string, dto: CommentCreateDto, isAdmin = false): Promise<Comment> {
    this.logger.log(`createThread ({board: ${board}, ip: ${ip}, dto: ${dto.toString()}, isAdmin: ${isAdmin}})`);

    const foundBoard = await this.boardService.findEntityBySlug(board);

    dto.comment = this.escapeHtmlIfAdmin(dto, isAdmin);
    dto.name = this.processPosterName(dto.name, isAdmin);

    this.checkIpBan(ip);
    this.checkFieldSpam(dto);
    this.checkFile(dto);
    await this.checkMaxActiveCommentSize(board);
    await this.checkDelay(ip);

    const attachedFile = await this.attachedFileService.saveFile(board, dto);

    const newThread = dto.toCreateInput(await this.calculateDisplayNumber(board), ip);
    newThread.board = { connect: { id: foundBoard.id } };
    newThread.lastHit = new Date();

    if (attachedFile) {
      newThread.attachedFile = { connect: { id: attachedFile.id } };
    }

    const createdThread = await this.prisma.comment.create({
      data: newThread,
      include: { board: true, attachedFile: true }
    });

    this.logger.log(`Object created: [Comment] {id: ${createdThread.id}}`);

    return createdThread;
  }

  public async createReply(board: string, displayNumber: number, ip: string, dto: CommentCreateDto, isAdmin = false): Promise<Comment> {
    this.logger.log(`createReply ({board: ${board}, displayNumber: ${displayNumber}, ip: ${ip}, dto: ${dto.toString()}, isAdmin: ${isAdmin}})`);

    const foundBoard = await this.boardService.findEntityBySlug(board);
    const foundParent = await this.findOneEntity({ displayNumber, board: { slug: board } });

    dto.comment = this.escapeHtmlIfAdmin(dto, isAdmin);
    dto.name = this.processPosterName(dto.name, isAdmin);

    this.checkIpBan(ip);
    this.checkFieldSpam(dto);
    this.checkFile(dto);
    await this.checkDelay(ip, 15000);

    const attachedFile = await this.attachedFileService.saveFile(board, dto);

    const newReply = dto.toCreateInput(await this.calculateDisplayNumber(board), ip);
    newReply.board = { connect: { id: foundBoard.id } };
    newReply.lastHit = null;
    newReply.parent = { connect: { id: foundParent.id } };

    if (attachedFile) {
      newReply.attachedFile = { connect: { id: attachedFile.id } };
    }

    const createdReply = await this.prisma.comment.create({
      data: newReply,
      include: { board: true, attachedFile: true }
    });

    this.logger.log(`Object created: [Comment] {id: ${createdReply.id}}`);

    await this.updateLastHit(foundParent, dto);

    return createdReply;
  }

  private escapeHtmlIfAdmin(dto: CommentCreateDto, isAdmin: boolean): string {
    if (!isAdmin) {
      dto.comment = this.escapeHtml(dto.comment);
    }

    return dto.comment;
  }

  private processPosterName(name: string, isAdmin: boolean): string {
    if (name === '' || name === undefined) {
      return this.config.getOrThrow('constants.placeholders.name');
    }

    return name;
  }

  private escapeHtml(comment: string): string {
    return comment;
  }

  private checkIpBan(ip: string): void {}

  private checkFieldSpam(dto: CommentCreateDto): void {}

  private checkFile(dto: CommentCreateDto) {
    if (dto.file) {
      if (!this.attachedFileService.checkIfAttachedImage(dto.file)) {
        const message: string = 'Attachment file is not an image';

        this.logger.warn(message);
        throw new BadRequestException(message);
      }
    }
  }

  private async checkMaxActiveCommentSize(board: string): Promise<void> {
    const currentThreadCount = await this.prisma.comment.count({
      where: { board: { slug: board }, lastHit: { not: null } },
    });

    const maxThreads = this.config.getOrThrow<number>('constants.max.threads');

    if (currentThreadCount + 1 > maxThreads) {
      const message = `Thread limit has been reached on board /${board}: ${currentThreadCount}`;

      this.logger.warn(message);
      throw new BadRequestException(message);
    }
  }

  private async checkDelay(ip: string, maxDelayMilliseconds = 30000): Promise<void> {
    const lastPost = await this.prisma.comment.findFirst({
      where: { ip },
      orderBy: { createdAt: 'desc' }
    });

    if (lastPost) {
      const currentTime = DateTime.now().toMillis();
      const lastPostTime = DateTime.fromJSDate(lastPost.createdAt).toMillis();

      if (currentTime - lastPostTime <= maxDelayMilliseconds) {
        this.logger.warn(`Trying to send comments too frequent, ip: ${ip}`);
        throw new BadRequestException('You are trying to send comments too frequent!');
      }
    }
  }

  private async calculateDisplayNumber(board: string): Promise<number> {
    const lastComment = await this.prisma.comment.findFirst({
      where: { board: { slug: board } },
      include: { board: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!lastComment) {
      return 1;
    }

    return lastComment.displayNumber + 1;
  }

  private async updateLastHit(comment: Comment, dto: CommentCreateDto): Promise<void> {
    this.logger.log(`updateLastHit ({comment: ${JSON.stringify(comment)}, dto: ${dto.toString()})`);

    const option = dto.options.trim().toLowerCase();

    const bumpLimit = this.config.getOrThrow<number>('constants.max.bump-limit');
    const currentRepliesLength = comment['children'].length;

    if (option !== 'sage' && currentRepliesLength <= bumpLimit) {
      this.logger.log(`Last hit will be updated ({ option: ${option}, parentLength: ${currentRepliesLength} })`);
      await this.prisma.comment.update({ data: { lastHit: new Date() }, where: { id: comment.id } });
    } else {
      this.logger.log(`Last hit will not be updated ({ option: ${option}, parentLength: ${currentRepliesLength} })`);
    }
  }
}
