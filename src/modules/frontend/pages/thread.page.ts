import { BoardDto } from '@backend/dto/board';
import { ThreadDto } from '@frontend/dto';

export class ThreadPage {
  board: BoardDto;

  password: string;

  thread: ThreadDto;

  static builder(): ThreadPageBuilder {
    return new ThreadPageBuilder();
  }
}

class ThreadPageBuilder {
  private readonly threadPage: ThreadPage = new ThreadPage();

  public board(board: BoardDto): ThreadPageBuilder {
    this.threadPage.board = board;
    return this;
  }

  public password(password: string): ThreadPageBuilder {
    this.threadPage.password = password;
    return this;
  }

  public thread(thread: ThreadDto): ThreadPageBuilder {
    this.threadPage.thread = thread;
    return this;
  }

  public build(): ThreadPage {
    return this.threadPage;
  }
}
