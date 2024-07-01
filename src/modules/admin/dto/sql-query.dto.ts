import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class SqlQueryDto {
  @IsString(LOCALE.validators['isString']('query'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('query'))
  query: string;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('runAsMutation'))
  @MaxLength(2, LOCALE.validators['maxLength']('runAsMutation', 2))
  runAsMutation?: 'on' | undefined;
}
