import { IsEnum, IsIP, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { LOCALE } from '@utils/locale';

export enum RemoveCommentMode {
  ONLY_COMMENT = 'ONLY_COMMENT',
  ONLY_FILE = 'ONLY_FILE',
  ALL_BY_IP = 'ALL_BY_IP'
}

export class RemoveCommentDto {
  @IsEnum(RemoveCommentMode, LOCALE.validators['isEnum']('mode'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('mode'))
  mode: RemoveCommentMode;

  @IsUUID('4', LOCALE.validators['isUUID']('commentId'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('commentId'))
  commentId: string;

  @IsIP('4', LOCALE.validators['isIp']('ip'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('ip'))
  ip: string;

  @IsString(LOCALE.validators['isString']('redirectAfterDeletion'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('redirectAfterDeletion'))
  redirectAfterDeletion: string;
}

export class RemoveCommentRequestDto {
  @IsString(LOCALE.validators['isString']('payload'))
  @IsNotEmpty(LOCALE.validators['isNotEmpty']('payload'))
  payload: string;
}
