import { IsString } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class IpFilterUpdateDto {
  @IsString(LOCALE.validators['isString']('ipList'))
  ipList: string;
}
