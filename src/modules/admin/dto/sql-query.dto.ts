import { IsNotEmpty, IsString } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class SqlQueryDto {
  @IsString(LOCALE.validators['isString']('query'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('query'))
  query: string;
}
