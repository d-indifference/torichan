import { IsEnum, IsIP, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum RemoveCommentMode {
  ONLY_COMMENT = 'ONLY_COMMENT',
  ONLY_FILE = 'ONLY_FILE',
  ALL_BY_IP = 'ALL_BY_IP'
}

export class RemoveCommentDto {
  @IsEnum(RemoveCommentMode)
  @IsNotEmpty()
  mode: RemoveCommentMode;

  @IsUUID('4')
  @IsNotEmpty()
  commentId: string;

  @IsIP()
  @IsNotEmpty()
  ip: string;

  @IsString()
  @IsNotEmpty()
  redirectAfterDeletion: string;
}

export class RemoveCommentRequestDto {
  @IsString()
  @IsNotEmpty()
  payload: string;
}
