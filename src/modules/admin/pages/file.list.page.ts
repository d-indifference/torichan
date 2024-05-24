import { AbstractPageable } from '@utils/abstract';
import { FileDisplayDto, SessionPayloadDto } from '@admin/dto';
import { BoardDto } from '@backend/dto/board';

export class FileListPage extends AbstractPageable {
  allBoards: BoardDto[];

  currentBoard?: BoardDto;

  session: SessionPayloadDto;

  files: FileDisplayDto[];
}
