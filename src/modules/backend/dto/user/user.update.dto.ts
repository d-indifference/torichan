import { Prisma, UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PasswordCryptoService } from '@utils/services';
import { LOCALE } from '@utils/locale';

export class UserUpdateDto {
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
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  @IsString(LOCALE.validators['isString']('password'))
  @MaxLength(256, LOCALE.validators['maxLength']('password', 256))
  password?: string;

  public toUpdateInput(passwordCrypto: PasswordCryptoService): Prisma.UserUpdateInput {
    const updateInput: Prisma.UserUpdateInput = {
      username: this.username,
      email: this.email
    };

    if (this.role) {
      updateInput.role = this.role;
    }

    if (this.password !== undefined && this.password !== null && this.password !== '') {
      updateInput.encryptedPassword = passwordCrypto.encrypt(this.password);
    }

    return updateInput;
  }
}
