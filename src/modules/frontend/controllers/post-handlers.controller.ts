import { Body, Controller, Param, ParseIntPipe, Post, Res, Session, ValidationPipe } from '@nestjs/common';
import { CommentService } from '@frontend/services';
import { CommentCreateDto } from '@backend/dto/comment';
import { Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { ParsePositiveNumberPipe } from '@utils/pipes';
import { CommentRemoveDto } from '@frontend/dto';
import { NormalizeRemoveCommentDtoPipe } from '@frontend/pipes';
import { SessionDto } from '@admin/dto';
import { RealIP } from 'nestjs-real-ip';

@Controller()
export class PostHandlersController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:board/post')
  @FormDataRequest()
  public async createThread(
    @Param('board') board: string,
    @Body(new ValidationPipe({ transform: true })) dto: CommentCreateDto,
    @Session() session: SessionDto,
    @RealIP() ip: string,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.createThread(board, ip, dto, res, session);
  }

  @Post('/:board/res/:displayNumber/post')
  @FormDataRequest()
  public async createReply(
    @Param('board') board: string,
    @Param('displayNumber', ParseIntPipe, ParsePositiveNumberPipe) displayNumber: number,
    @Body(new ValidationPipe({ transform: true })) dto: CommentCreateDto,
    @Session() session: SessionDto,
    @RealIP() ip: string,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.createReply(board, displayNumber, ip, dto, res, session);
  }

  @Post('/:board/delete')
  @FormDataRequest()
  public async deleteCommentsFromBoardPage(
    @Param('board') board: string,
    @Body(NormalizeRemoveCommentDtoPipe) dto: CommentRemoveDto,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.removeAndRedirectToBoard(board, dto, res);
  }

  @Post('/:board/res/:displayNumber/delete')
  @FormDataRequest()
  public async deleteCommentsFromThreadPage(
    @Param('board') board: string,
    @Param('displayNumber', ParseIntPipe, ParsePositiveNumberPipe) displayNumber: number,
    @Body(NormalizeRemoveCommentDtoPipe) dto: CommentRemoveDto,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.removeAndRedirectToThread(board, displayNumber, dto, res);
  }
}
