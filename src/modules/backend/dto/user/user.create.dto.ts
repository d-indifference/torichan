import { Prisma, UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { PasswordCryptoService } from '@utils/services';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(256)
  password: string;

  public toCreateInput(passwordCrypto: PasswordCryptoService): Prisma.UserCreateInput {
    return {
      username: this.username,
      email: this.email,
      role: this.role,
      encryptedPassword: passwordCrypto.enrcypt(this.password)
    };
  }
}
