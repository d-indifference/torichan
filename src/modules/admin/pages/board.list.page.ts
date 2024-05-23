import { AbstractPageable } from '@utils/abstract';
import { SessionPayloadDto } from '@admin/dto';
import { BoardDto } from '@backend/dto/board';

export class BoardListPage extends AbstractPageable {
  session: SessionPayloadDto;

  boards: BoardDto[];
}
