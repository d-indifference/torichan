import { SessionPayloadDto } from '@admin/dto/session-payload.dto';

export class SqlQueryOutputDto {
  session: SessionPayloadDto;

  query: string;

  queryResult: unknown;
}
