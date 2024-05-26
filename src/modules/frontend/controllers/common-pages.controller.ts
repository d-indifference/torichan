import { Controller, Get, Param, ParseIntPipe, Render, Req, Session } from '@nestjs/common';
import { BoardPage, IndexPage, ThreadPage } from '@frontend/pages';
import { BoardService, IndexService, ThreadService } from '@frontend/services';
import { ParsePositiveNumberPipe } from '@utils/pipes';
import { Request } from 'express';
import { SessionDto } from '@admin/dto';

@Controller()
export class CommonPagesController {
  constructor(
    private readonly indexService: IndexService,
    private readonly boardService: BoardService,
    private readonly threadService: ThreadService
  ) {}

  @Get('/')
  @Render('index')
  public async index(): Promise<IndexPage> {
    return await this.indexService.index();
  }

  @Get('/faq')
  @Render('faq')
  public faq(): void {}

  @Get('/rules')
  @Render('rules')
  public rules(): void {}

  @Get('/:slug')
  @Render('board')
  public async board(@Param('slug') slug: string, @Session() session: SessionDto, @Req() req: Request): Promise<BoardPage> {
    return await this.boardService.getBoardPage(slug, req.cookies, session);
  }

  @Get('/:slug/:page')
  @Render('board')
  public async boardWithPageNumber(
    @Param('slug') slug: string,
    @Param('page', ParseIntPipe, ParsePositiveNumberPipe) page: number,
    @Session() session: SessionDto,
    @Req() req: Request
  ): Promise<BoardPage> {
    return await this.boardService.getBoardPage(slug, req.cookies, session, page);
  }

  @Get('/:slug/res/:displayNumber')
  @Render('thread')
  public async thread(
    @Param('slug') slug: string,
    @Param('displayNumber', ParseIntPipe, ParsePositiveNumberPipe) displayNumber: number,
    @Session() session: SessionDto,
    @Req() req: Request
  ): Promise<ThreadPage> {
    return await this.threadService.getThreadPage(slug, displayNumber, req.cookies, session);
  }
}
