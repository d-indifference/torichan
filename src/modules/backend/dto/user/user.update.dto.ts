import { Prisma, UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PasswordCryptoService } from '@utils/services';

export class UserUpdateDto {
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
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  @MaxLength(256)
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
      updateInput.encryptedPassword = passwordCrypto.enrcypt(this.password);
    }

    return updateInput;
  }
}
