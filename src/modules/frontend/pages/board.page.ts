import { BoardDto } from '@backend/dto/board';
import { AbstractPageable } from '@utils/abstract';
import { ThreadDto } from '@frontend/dto';
import { SessionPayloadDto } from '@admin/dto';
import { CommentPageMode } from '@frontend/enums';

export class BoardPage extends AbstractPageable {
  session?: SessionPayloadDto;

  pageMode: CommentPageMode;

  board: BoardDto;

  boards: BoardDto[];

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

  public session(session?: SessionPayloadDto): BoardPageBuilder {
    if (session) {
      this.boardPage.session = session;
    } else {
      this.boardPage.session = null;
    }

    return this;
  }

  public pageMode(pageMode: CommentPageMode): BoardPageBuilder {
    this.boardPage.pageMode = pageMode;
    return this;
  }

  public board(board: BoardDto): BoardPageBuilder {
    this.boardPage.board = board;
    return this;
  }

  public boards(boards: BoardDto[]): BoardPageBuilder {
    this.boardPage.boards = boards;
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
