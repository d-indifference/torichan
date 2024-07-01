import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { LOCALE } from '@utils/locale';

export class SignInDto {
  @IsString(LOCALE.validators['isString']('username'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('username'))
  @MinLength(3, LOCALE.validators['minLength']('username', 3))
  @MaxLength(255, LOCALE.validators['maxLength']('username', 255))
  username: string;

  @IsString(LOCALE.validators['isString']('password'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('password'))
  @MinLength(3, LOCALE.validators['minLength']('password', 3))
  @MaxLength(255, LOCALE.validators['maxLength']('password', 255))
  password: string;
}
