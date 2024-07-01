import { UserDto } from '@backend/dto/user';
import { Ban } from '@prisma/client';
import { DateTime } from 'luxon';
import { LOCALE } from '@utils/locale';

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
      createdAt: DateTime.fromJSDate(model.createdAt).toFormat('EEE dd MMM yyyy HH:mm:ss', { locale: LOCALE.luxon as string }),
      till: DateTime.fromJSDate(model.till).toFormat('EEE dd MMM yyyy HH:mm:ss', { locale: LOCALE.luxon as string }),
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
