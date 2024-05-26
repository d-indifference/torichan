/* eslint-disable prettier/prettier  */
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { AttachedFile, Comment, Prisma } from '@prisma/client';
import { CommentCreateDto, CommentDto } from '@backend/dto/comment';
import { DateTime } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { BoardService } from '@backend/services/board.service';
import { AttachedFileService } from '@backend/services/attached-file.service';
import { PrismaTakeSkipDto } from '@utils/misc';
import { BanService } from '@backend/services/ban.service';
import { SpamService } from '@backend/services/spam.service';
import * as he from 'he';
import { replyMarkdown, threadMarkdown } from '@backend/functions';

@Injectable()
export class CommentService {
  private readonly logger: Logger = new Logger(CommentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly boardService: BoardService,
    private readonly attachedFileService: AttachedFileService,
    private readonly banService: BanService,
    private readonly spamService: SpamService
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

  public async createThread(board: string, ip: string, dto: CommentCreateDto, isAdmin = false): Promise<Comment> {
    this.logger.log(`createThread ({board: ${board}, ip: ${ip}, dto: ${dto.toString()}, isAdmin: ${isAdmin}})`);

    await this.checkFieldSpam(dto, isAdmin);

    const delayAfterThread = this.config.getOrThrow<number>('constants.max.delay-between-threads');

    const foundBoard = await this.boardService.findEntityBySlug(board);

    dto.comment = this.processThreadMarkdown(dto, isAdmin);
    dto.name = this.processPosterName(dto.name, isAdmin);

    await this.checkIpBan(ip);
    this.checkFile(dto);
    await this.checkDelay(ip, delayAfterThread);

    const attachedFile = await this.attachedFileService.saveFile(board, dto);

    const newThread = dto.toCreateInput(foundBoard.postCount + 1, ip);
    newThread.board = { connect: { id: foundBoard.id } };
    newThread.lastHit = new Date();

    if (attachedFile) {
      newThread.attachedFile = { connect: { id: attachedFile.id } };
    }

    const createdThread = await this.prisma.comment.create({
      data: newThread,
      include: { board: true, attachedFile: true }
    });

    await this.setFileToComment(createdThread.id, attachedFile);

    await this.boardService.incrementPostCount(foundBoard.id);

    this.logger.log(`Object created: [Comment] {id: ${createdThread.id}}`);

    await this.rotateThreads(board);

    return createdThread;
  }

  public async createReply(board: string, displayNumber: number, ip: string, dto: CommentCreateDto, isAdmin = false): Promise<Comment> {
    this.logger.log(`createReply ({board: ${board}, displayNumber: ${displayNumber}, ip: ${ip}, dto: ${dto.toString()}, isAdmin: ${isAdmin}})`);

    await this.checkFieldSpam(dto, isAdmin);

    const delayAfterReply = this.config.getOrThrow<number>('constants.max.delay-between-replies');

    const foundBoard = await this.boardService.findEntityBySlug(board);
    const foundParent = await this.findOneEntity({ displayNumber, board: { slug: board } });

    dto.comment = this.processReplyMarkdown(dto, board, displayNumber, isAdmin);
    dto.name = this.processPosterName(dto.name, isAdmin);

    await this.checkIpBan(ip);
    this.checkFile(dto);
    await this.checkDelay(ip, delayAfterReply);

    const attachedFile = await this.attachedFileService.saveFile(board, dto);

    const newReply = dto.toCreateInput(foundBoard.postCount + 1, ip);
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

    await this.setFileToComment(createdReply.id, attachedFile);

    this.logger.log(`Object created: [Comment] {id: ${createdReply.id}}`);

    await this.updateLastHit(foundParent, dto);
    await this.boardService.incrementPostCount(foundBoard.id);

    return createdReply;
  }

  private async setFileToComment(commentId: string, attachedFile: AttachedFile): Promise<void> {
    if (attachedFile) {
      await this.prisma.comment.update({ data: { attachedFileId: attachedFile.id }, where: { id: commentId } });
    }
  }

  public async clearAttachedFile(where: Prisma.CommentWhereInput): Promise<void> {
    this.logger.log(`clearAttachedFile ({where: ${where})`);

    const comments = await this.prisma.comment.findMany({ where, include: { attachedFile: true } });

    for (const comment of comments) {
      if (comment.attachedFile) {
        await this.attachedFileService.removeEntity(comment.attachedFile);
      }
    }
  }

  public async remove(where: Prisma.CommentWhereInput): Promise<void> {
    this.logger.log(`remove ({where: ${where})`);

    const comments = await this.prisma.comment.findMany({ where, include: { attachedFile: true } });

    for (const comment of comments) {
      if (comment.attachedFile) {
        await this.attachedFileService.removeEntity(comment.attachedFile);
      }

      await this.prisma.comment.deleteMany({ where });
    }

    await this.removeOrphans();
  }

  private async rotateThreads(boardSlug: string): Promise<void> {
    this.logger.log(`rotateThreads ({boardSlug: ${boardSlug}})`);

    const maxThreads = this.config.getOrThrow<number>('constants.max.threads');
    const maxThreadLivingTime = this.config.getOrThrow<number>('constants.max.thread-living-ms');
    const currentThreadCount = await this.count({ lastHit: { not: null }, board: { slug: boardSlug } });

    if (currentThreadCount > maxThreads) {
      this.logger.log('Threads will be rotated');

      const oldThreadTimeCreation = DateTime
        .now()
        .minus({ milliseconds: maxThreadLivingTime })
        .toJSDate();

      await this.remove({ lastHit: { lte: oldThreadTimeCreation }, board: { slug: boardSlug } });
    }
  }

  private async removeOrphans(): Promise<void> {
    const orphanedComments = await this.prisma.comment.findMany({ where: { lastHit: null, parent: null }, include: { attachedFile: true } });

    for (const comment of orphanedComments) {
      if (comment.attachedFile) {
        await this.attachedFileService.removeEntity(comment.attachedFile);
      }

      await this.prisma.comment.delete({ where: { id: comment.id } });
    }
  }

  private processThreadMarkdown(dto: CommentCreateDto, isAdmin: boolean): string {
    let commentStr = dto.comment;

    if (!isAdmin) {
      commentStr = this.escapeHtml(dto.comment, isAdmin);
    }

    return threadMarkdown(commentStr);
  }

  private processReplyMarkdown(dto: CommentCreateDto, slug: string, parent: number, isAdmin: boolean): string {
    let commentStr = dto.comment;

    if (!isAdmin) {
      commentStr = this.escapeHtml(dto.comment, isAdmin);
    }

    return replyMarkdown(commentStr, slug, parent);
  }

  private processPosterName(name: string, isAdmin: boolean): string {
    if (name === '' || name === undefined) {
      if (isAdmin) {
        return 'Moderator';
      }

      return this.config.getOrThrow('constants.placeholders.name');
    }

    return name;
  }

  private escapeHtml(comment: string, isAdmin: boolean): string {
    if (isAdmin) {
      return comment;
    }

    return he.encode(comment);
  }

  private async checkIpBan(ip: string): Promise<void> {
    await this.banService.checkActiveBan(ip);
  }

  private async checkFieldSpam(dto: CommentCreateDto, isAdmin: boolean): Promise<void> {
    if (!isAdmin) {
      await this.spamService.checkSpam(dto.name);
      await this.spamService.checkSpam(dto.subject);
      await this.spamService.checkSpam(dto.comment);
    }
  }

  private checkFile(dto: CommentCreateDto) {
    if (dto.file) {
      if (!this.attachedFileService.checkIfAttachedImage(dto.file)) {
        const message: string = 'Attachment file is not an image';

        this.logger.warn(message);
        throw new BadRequestException(message);
      }
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

  private async updateLastHit(comment: Comment, dto: CommentCreateDto): Promise<void> {
    this.logger.log(`updateLastHit ({comment: ${JSON.stringify(comment)}, dto: ${dto.toString()})`);

    const option = dto.options.trim().toLowerCase();

    const bumpLimit = this.config.getOrThrow<number>('constants.max.bump-limit');
    const currentRepliesLength = comment['children'].length;

    if (option !== 'sage' && currentRepliesLength <= bumpLimit) {
      this.logger.log(`Last hit will be updated ({ option: ${option}, parentLength: ${currentRepliesLength} })`);
      await this.prisma.comment.update({ data: { lastHit: new Date() }, where: { id: comment.id } });
    } else {
      this.logger.log(`Last hit will not be updated ({ option: ${option}, repliesLength: ${currentRepliesLength} })`);
    }
  }
}
