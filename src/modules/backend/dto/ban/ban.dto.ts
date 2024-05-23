import { UserDto } from '@backend/dto/user';
import { Ban } from '@prisma/client';
import { DateTime } from 'luxon';

export class BanDto {
  id: string;

  ip: string;

  createdAt: string;

  till: string;

  reason: string;

  user: UserDto;

  public static fromModel(model: Ban): BanDto {
    return {
      id: model.id,
      ip: model.ip,
      createdAt: DateTime.fromJSDate(model.createdAt).toFormat('EEE dd MMM yyyy HH:mm:ss'),
      till: DateTime.fromJSDate(model.till).toFormat('EEE dd MMM yyyy HH:mm:ss'),
      reason: model.reason,
      user: {
        id: model['user'].id,
        username: model['user'].username,
        email: model['user'].email,
        role: model['user'].role
      }
    };
  }
}
