import { AbstractPageable } from '@utils/abstract';
import { SessionPayloadDto } from '@admin/dto';
import { CommentDto } from '@backend/dto/comment';
import { BoardDto } from '@backend/dto/board';

export class CommentListPage extends AbstractPageable {
  session: SessionPayloadDto;

  comments: CommentDto[];

  currentBoard?: BoardDto;

  allBoards: BoardDto[];
}
