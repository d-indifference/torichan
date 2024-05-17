import { Body, Controller, Param, ParseIntPipe, Post, Req, Res, ValidationPipe } from '@nestjs/common';
import { CommentService } from '@frontend//services';
import { CommentCreateDto } from '@backend/dto/comment';
import { Request, Response } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { ParsePositiveNumberPipe } from '@utils/pipes';

@Controller()
export class PostHandlersController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:board/post')
  @FormDataRequest()
  public async createThread(
    @Param('board') board: string,
    @Body(new ValidationPipe({ transform: true })) dto: CommentCreateDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.createThread(board, req.ip, dto, res);
  }

  @Post('/:board/res/:displayNumber/post')
  @FormDataRequest()
  public async createReply(
    @Param('board') board: string,
    @Param('displayNumber', ParseIntPipe, ParsePositiveNumberPipe) displayNumber: number,
    @Body(new ValidationPipe({ transform: true })) dto: CommentCreateDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.createReply(board, displayNumber, req.ip, dto, res);
  }
}
