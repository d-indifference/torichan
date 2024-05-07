import { BoardDto } from '@backend/dto/board';
import { AbstractPageable } from '@utils/abstract';

export class BoardPage extends AbstractPageable {
  board: BoardDto;

  static builder(): BoardPageBuilder {
    return new BoardPageBuilder();
  }
}

class BoardPageBuilder {
  private readonly boardPage = new BoardPage();

  public maxPage(maxPage: number): BoardPageBuilder {
    this.boardPage.maxPage = maxPage;
    return this;
  }

  public board(board: BoardDto): BoardPageBuilder {
    this.boardPage.board = board;
    return this;
  }

  public build(): BoardPage {
    return this.boardPage;
  }
}
