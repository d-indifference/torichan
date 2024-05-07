import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { BoardPage } from '@frontend/pages';
import { BoardService } from '@frontend/services';

@Controller()
export class CommonPagesController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/')
  @Render('index')
  public index(): void {}

  @Get('/:slug')
  @Render('board')
  public async board(@Param('slug') slug: string): Promise<BoardPage> {
    return await this.boardService.getBoardPage(slug);
  }

  @Get('/:slug/:page')
  @Render('board')
  public async boardWithPageNumber(@Param('slug') slug: string, @Param('page', ParseIntPipe) page: number): Promise<BoardPage> {
    return await this.boardService.getBoardPage(slug, page);
  }
}
