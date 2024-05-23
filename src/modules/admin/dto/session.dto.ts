import { Cookie } from 'express-session';
import { SessionPayloadDto } from '@admin/dto/session-payload.dto';

export class SessionDto {
  cookie: Cookie;

  payload: SessionPayloadDto;
}
