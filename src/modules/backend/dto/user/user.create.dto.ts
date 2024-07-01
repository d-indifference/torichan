import { Prisma, UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { PasswordCryptoService } from '@utils/services';
import { LOCALE } from '@utils/locale';

export class UserCreateDto {
  @IsString(LOCALE.validators['isString']('username'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('username'))
  @MinLength(3, LOCALE.validators['minLength']('username', 3))
  @MaxLength(256, LOCALE.validators['maxLength']('username', 256))
  username: string;

  @IsString(LOCALE.validators['isString']('email'))
  @IsEmail(null, LOCALE.validators['isEmail']('email'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('email'))
  email: string;

  @IsEnum(UserRole, LOCALE.validators['isEnum']('role'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('role'))
  role: UserRole;

  @IsString(LOCALE.validators['isString']('password'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('password'))
  @MinLength(6, LOCALE.validators['minLength']('password', 6))
  @MaxLength(256, LOCALE.validators['maxLength']('password', 256))
  password: string;

  public toCreateInput(passwordCrypto: PasswordCryptoService): Prisma.UserCreateInput {
    return {
      username: this.username,
      email: this.email,
      role: this.role,
      encryptedPassword: passwordCrypto.encrypt(this.password)
    };
  }
}
