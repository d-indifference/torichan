import { User, UserRole } from '@prisma/client';

export class UserDto {
  id: string;

  username: string;

  email: string;

  role: UserRole;

  constructor(id: string, username: string, email: string, role: UserRole) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
  }

  public static fromModel(model: User): UserDto {
    return new UserDto(model.id, model.username, model.email, model.role);
  }
}
