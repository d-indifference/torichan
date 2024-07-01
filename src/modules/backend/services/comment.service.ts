/* eslint-disable prettier/prettier  */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CaptchaService, PrismaService } from '@utils/services';
import { AttachedFile, BoardSettings, Comment, FileAttachmentMode, Prisma } from '@prisma/client';
import { CommentCreateDto } from '@backend/dto/comment';
import { DateTime } from 'luxon';
import { BoardService } from '@backend/services/board.service';
import { AttachedFileService } from '@backend/services/attached-file.service';
import { BanService } from '@backend/services/ban.service';
import { SpamService } from '@backend/services/spam.service';
import * as he from 'he';
import { replyMarkdown, replySimpleMarkdown, threadMarkdown, threadSimpleMarkdown, generateTripcode } from '@backend/functions';
import { CommentsQueries } from '@backend/services/comment.queries';
import { LOCALE } from '@utils/locale';

@Injectable()
export class CommentService {
  private readonly logger: Logger = new Logger(CommentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly boardService: BoardService,
    private readonly attachedFileService: AttachedFileService,
    private readonly banService: BanService,
    private readonly spamService: SpamService,
    private readonly captchaService: CaptchaService,
    private readonly commentQueries: CommentsQueries
  ) {}

  public async createThread(board: string, ip: string, dto: CommentCreateDto, isAdmin = false): Promise<Comment> {
    this.logger.log(`createThread ({board: ${board}, ip: ${ip}, dto: ${dto.toString()}, isAdmin: ${isAdmin}})`);

    await this.checkFieldSpam(dto, isAdmin);

    const foundBoard = await this.boardService.findEntityBySlug(board);
    const boardSettings: BoardSettings = foundBoard['boardSettings'];

    this.applyCaptchaPolicy(dto, isAdmin, boardSettings);
    this.applySettingsPolicy(boardSettings, dto, false);

    const delayAfterThread = boardSettings.delayAfterThread * 1000;

    dto.comment = this.processThreadMarkdown(dto, isAdmin, boardSettings);
    dto.name = this.processPosterName(dto.name, isAdmin, boardSettings);

    await this.checkIpBan(ip);
    this.checkFile(dto);
    await this.checkDelay(ip, delayAfterThread);

    const attachedFile = await this.attachedFileService.saveFile(board, dto);

    const newThread = dto.toCreateInput(foundBoard.postCount + 1, ip);
    newThread.board = { connect: { id: foundBoard.id } };
    newThread.lastHit = new Date();
    newThread.tripcode = this.applyTripcodePolicy(dto.name, boardSettings);

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

    const foundBoard = await this.boardService.findEntityBySlug(board);
    const foundParent = await this.commentQueries.findOneEntity({ displayNumber, board: { slug: board } });
    const boardSettings: BoardSettings = foundBoard['boardSettings'];

    this.applyCaptchaPolicy(dto, isAdmin, boardSettings);
    this.applySettingsPolicy(boardSettings, dto, true);

    const delayAfterReply = boardSettings.delayAfterReply * 1000;

    dto.comment = this.processReplyMarkdown(dto, board, displayNumber, isAdmin, boardSettings);
    dto.name = this.processPosterName(dto.name, isAdmin, boardSettings);

    await this.checkIpBan(ip);
    this.checkFile(dto);
    await this.checkDelay(ip, delayAfterReply);

    const attachedFile = await this.attachedFileService.saveFile(board, dto);

    const newReply = dto.toCreateInput(foundBoard.postCount + 1, ip);
    newReply.board = { connect: { id: foundBoard.id } };
    newReply.lastHit = null;
    newReply.parent = { connect: { id: foundParent.id } };
    newReply.tripcode = this.applyTripcodePolicy(dto.name, boardSettings);

    if (attachedFile) {
      newReply.attachedFile = { connect: { id: attachedFile.id } };
    }

    const createdReply = await this.prisma.comment.create({
      data: newReply,
      include: { board: true, attachedFile: true }
    });

    await this.setFileToComment(createdReply.id, attachedFile);

    this.logger.log(`Object created: [Comment] {id: ${createdReply.id}}`);

    await this.updateLastHit(foundParent, dto, boardSettings);
    await this.boardService.incrementPostCount(foundBoard.id);

    return createdReply;
  }

  private applyTripcodePolicy(name: string, settings: BoardSettings): string {
    if (settings.allowTripcodes && name) {
      if (name.split('#').length > 1) {
        return generateTripcode(name);
      }
    }

    return null;
  }

  private applySettingsPolicy(settings: BoardSettings, dto: CommentCreateDto, isReply: boolean): void {
    if (!settings.allowPosting) {
      throw new BadRequestException(LOCALE.backend['youCannotPost']);
    }

    if (settings.strictAnonymity && dto.name) {
      throw new BadRequestException(LOCALE.backend['youMustBeAnonymous']);
    }

    if (isReply) {
      if (dto.file && settings.replyFileAttachmentMode === FileAttachmentMode.FORBIDDEN) {
        throw new BadRequestException(LOCALE.backend['postingOfFilesNotAllowed']);
      }

      if (!dto.file && settings.replyFileAttachmentMode === FileAttachmentMode.STRICT) {
        throw new BadRequestException(LOCALE.backend['pleaseAttachAnyFile']);
      }
    } else {
      if (dto.file && settings.threadFileAttachmentMode === FileAttachmentMode.FORBIDDEN) {
        throw new BadRequestException(LOCALE.backend['postingOfFilesNotAllowed']);
      }

      if (!dto.file && settings.threadFileAttachmentMode === FileAttachmentMode.STRICT) {
        throw new BadRequestException(LOCALE.backend['pleaseAttachAnyFile']);
      }
    }

    if (dto.file) {
      if (dto.file.size < settings.minFileSize) {
        throw new BadRequestException(LOCALE.backend['fileTooSmall']);
      }

      if (dto.file.size > settings.maxFileSize) {
        throw new BadRequestException(LOCALE.backend['fileTooBig']);
      }
    }

    if (!settings.strictAnonymity && dto.name.length > settings.maxStringFieldSize) {
      throw new BadRequestException(LOCALE.backend['nameTooLong']);
    }

    if (dto.options.length > settings.maxStringFieldSize) {
      throw new BadRequestException(LOCALE.backend['optionsTooLong']);
    }

    if (dto.subject.length > settings.maxStringFieldSize) {
      throw new BadRequestException(LOCALE.backend['subjectTooLong']);
    }

    if (dto.comment.length > settings.maxCommentSize) {
      throw new BadRequestException(LOCALE.backend['commentTooLong']);
    }
  }

  private applyCaptchaPolicy(dto: CommentCreateDto, isAdmin: boolean, settings: BoardSettings): void {
    if (!isAdmin && settings.enableCaptcha) {
      this.captchaService.solveCaptcha(dto.captcha, dto.nya, settings.isCaptchaCaseSensitive);
    }
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

    const board = await this.boardService.findEntityBySlug(boardSlug);
    const settings: BoardSettings = board['boardSettings'];

    const maxThreads = settings.maxThreadsOnBoard;
    const maxThreadLivingTime = settings.maxThreadLivingTime;
    const currentThreadCount = await this.commentQueries.count({ lastHit: { not: null }, board: { slug: boardSlug } });

    if (currentThreadCount > maxThreads) {
      this.logger.log('Threads will be rotated');

      const oldThreadLastHitTme = DateTime
        .now()
        .minus({ milliseconds: maxThreadLivingTime })
        .toJSDate();

      await this.removeOldestThread(boardSlug, oldThreadLastHitTme);
    }
  }

  private async removeOldestThread(boardSlug: string, lastHist: Date): Promise<void> {
    this.logger.log(`removeOldestThread ({boardSlug: ${boardSlug}, lastHist: ${lastHist})`);

    const oldestThread = await this.prisma.comment.findFirst({
      where: { lastHit: { lte: lastHist }, board: { slug: boardSlug } },
      include: { attachedFile: true },
      orderBy: { createdAt: 'desc' }
    });

    if (oldestThread.attachedFile) {
      await this.attachedFileService.removeEntity(oldestThread.attachedFile);
    }

    await this.prisma.comment.delete({ where: { id: oldestThread.id } });

    await this.removeOrphans();
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

  private processThreadMarkdown(dto: CommentCreateDto, isAdmin: boolean, settings: BoardSettings): string {
    let commentStr = dto.comment;

    if (!isAdmin) {
      commentStr = this.escapeHtml(dto.comment, isAdmin);
    }

    if (settings.allowMarkdown) {
      return threadMarkdown(commentStr);
    }

    return threadSimpleMarkdown(commentStr);
  }

  private processReplyMarkdown(dto: CommentCreateDto, slug: string, parent: number, isAdmin: boolean, settings: BoardSettings): string {
    let commentStr = dto.comment;

    if (!isAdmin) {
      commentStr = this.escapeHtml(dto.comment, isAdmin);
    }

    if (settings.allowMarkdown) {
      return replyMarkdown(commentStr, slug, parent);
    }

    return replySimpleMarkdown(commentStr, slug, parent);
  }

  private processPosterName(name: string, isAdmin: boolean, settings: BoardSettings): string {
    if (name === '' || name === undefined) {
      if (isAdmin) {
        return settings.defaultModeratorName;
      }

      return settings.defaultPosterName;
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
        const message: string = LOCALE.backend['fileIsNotAnImage'];

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
        throw new BadRequestException(LOCALE.backend['tooFrequentPosting']);
      }
    }
  }

  private async updateLastHit(comment: Comment, dto: CommentCreateDto, settings: BoardSettings): Promise<void> {
    this.logger.log(`updateLastHit ({comment: ${JSON.stringify(comment)}, dto: ${dto.toString()})`);

    const option = dto.options.trim().toLowerCase();

    const bumpLimit = settings.bumpLimit;
    const currentRepliesLength = comment['children'].length;

    if (option !== 'sage' && currentRepliesLength <= bumpLimit) {
      this.logger.log(`Last hit will be updated ({ option: ${option}, parentLength: ${currentRepliesLength} })`);
      await this.prisma.comment.update({ data: { lastHit: new Date() }, where: { id: comment.id } });
    } else {
      this.logger.log(`Last hit will not be updated ({ option: ${option}, repliesLength: ${currentRepliesLength} })`);
    }
  }
}
