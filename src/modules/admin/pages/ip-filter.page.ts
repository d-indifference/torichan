import { SessionPayloadDto } from '@admin/dto';

export class IpFilterPage {
  session: SessionPayloadDto;

  whiteList: string;

  blackList: string;
}
