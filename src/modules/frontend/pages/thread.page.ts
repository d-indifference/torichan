import { BoardDto } from '@backend/dto/board';
import { CaptchaDto, ThreadDto } from '@frontend/dto';
import { SessionPayloadDto } from '@admin/dto';
import { CommentPageMode } from '@frontend/enums';

export class ThreadPage {
  session?: SessionPayloadDto;

  pageMode: CommentPageMode;

  board: BoardDto;

  captcha: CaptchaDto;

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

  public captcha(captcha: CaptchaDto): ThreadPageBuilder {
    this.threadPage.captcha = captcha;
    return this;
  }

  public thread(thread: ThreadDto): ThreadPageBuilder {
    this.threadPage.thread = thread;
    return this;
  }

  public session(session?: SessionPayloadDto): ThreadPageBuilder {
    if (session) {
      this.threadPage.session = session;
    } else {
      this.threadPage.session = null;
    }

    return this;
  }

  public pageMode(pageMode: CommentPageMode): ThreadPageBuilder {
    this.threadPage.pageMode = pageMode;
    return this;
  }

  public build(): ThreadPage {
    return this.threadPage;
  }
}
