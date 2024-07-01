import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class CommentRemoveDto {
  @IsNumber(null, { each: true, ...LOCALE.validators['isNumber']('delete') })
  @IsNotEmpty({ each: true, ...LOCALE.validators['isNotEmpty']('delete') })
  @IsInt({ each: true, ...LOCALE.validators['isInt']('delete') })
  @IsPositive({ each: true, ...LOCALE.validators['isPositive']('delete') })
  delete: number[];

  @IsBoolean(LOCALE.validators['isBoolean']('delete'))
  fileOnly: boolean;

  @IsString(LOCALE.validators['isString']('password'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('password'))
  @MinLength(8, LOCALE.validators['minLength']('password', 8))
  @MaxLength(8, LOCALE.validators['maxLength']('password', 8))
  password: string;
}

export class CommentRemoveNotNormalizedDto {
  delete: string[] | string;

  fileOnly?: 'on' | undefined;

  password: string;
}
