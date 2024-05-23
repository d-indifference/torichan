import { AbstractPageable } from '@utils/abstract';
import { UserDto } from '@backend/dto/user';
import { SessionPayloadDto } from '@admin/dto';

export class UserListPage extends AbstractPageable {
  session: SessionPayloadDto;

  users: UserDto[];
}
