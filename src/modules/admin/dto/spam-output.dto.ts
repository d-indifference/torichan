import { SessionPayloadDto } from '@admin/dto/session-payload.dto';

export class SpamOutputDto {
  session: SessionPayloadDto;

  spam: string;
}
