/* eslint-disable prettier/prettier  */
import { Injectable } from '@nestjs/common';
import { BoardService as BackendBoardService } from '@backend/services/board.service';
import { BoardPage } from '@frontend/pages';
import { PaginationResolveService } from '@utils/services';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardService: BackendBoardService,
    private readonly paginationResolve: PaginationResolveService
  ) {}

  public async getBoardPage(slug: string, page = 0): Promise<BoardPage> {
    const board = await this.boardService.findBySlug(slug);

    return BoardPage
      .builder()
      .maxPage(0)
      .board(board)
      .build();
  }
}
