import { IsNotEmpty, IsString } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class SpamInputDto {
  @IsString(LOCALE.validators['isString']('spam'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('spam'))
  spam: string;
}
