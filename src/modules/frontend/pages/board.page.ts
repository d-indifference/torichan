import { BoardDto } from '@backend/dto/board';
import { AbstractPageable } from '@utils/abstract';
import { ThreadDto } from '@frontend/dto';

export class BoardPage extends AbstractPageable {
  board: BoardDto;

  password: string;

  threads: ThreadDto[];

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

  public currentPage(currentPage: number): BoardPageBuilder {
    this.boardPage.currentPage = currentPage;
    return this;
  }

  public board(board: BoardDto): BoardPageBuilder {
    this.boardPage.board = board;
    return this;
  }

  public threads(threads: ThreadDto[]): BoardPageBuilder {
    this.boardPage.threads = threads;
    return this;
  }

  public password(password: string): BoardPageBuilder {
    this.boardPage.password = password;
    return this;
  }

  public build(): BoardPage {
    return this.boardPage;
  }
}
