import { AbstractPageable } from '@utils/abstract';
import { SessionPayloadDto } from '@admin/dto';
import { BanDto } from '@backend/dto/ban';

export class BanListPage extends AbstractPageable {
  session: SessionPayloadDto;

  bans: BanDto[];
}
