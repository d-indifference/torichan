import { Controller, Get, Param, ParseIntPipe, Render, Req } from '@nestjs/common';
import { BoardPage, ThreadPage } from '@frontend/pages';
import { BoardService, ThreadService } from '@frontend/services';
import { ParsePositiveNumberPipe } from '@utils/pipes';
import { Request } from 'express';

@Controller()
export class CommonPagesController {
  constructor(
    private readonly boardService: BoardService,
    private readonly threadService: ThreadService
  ) {}

  @Get('/')
  @Render('index')
  public index(): void {}

  @Get('/:slug')
  @Render('board')
  public async board(@Param('slug') slug: string, @Req() req: Request): Promise<BoardPage> {
    return await this.boardService.getBoardPage(slug, req.cookies);
  }

  @Get('/:slug/:page')
  @Render('board')
  public async boardWithPageNumber(
    @Param('slug') slug: string,
    @Param('page', ParseIntPipe, ParsePositiveNumberPipe) page: number,
    @Req() req: Request
  ): Promise<BoardPage> {
    return await this.boardService.getBoardPage(slug, req.cookies, page);
  }

  @Get('/:slug/res/:displayNumber')
  @Render('thread')
  public async thread(
    @Param('slug') slug: string,
    @Param('displayNumber', ParseIntPipe, ParsePositiveNumberPipe) displayNumber: number,
    @Req() req: Request
  ): Promise<ThreadPage> {
    return await this.threadService.getThreadPage(slug, displayNumber, req.cookies);
  }
}
