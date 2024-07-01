import { filesize } from 'filesize';
import { DateTime } from 'luxon';
import { LOCALE } from '@utils/locale';

export class FileDto {
  filename: string;

  mimeType: string;

  sizeInBytes: number;

  createdAt: Date;

  width?: number;

  height?: number;

  thumbnail?: string;
}

export class FileDisplayDto {
  filename: string;

  mimeType: string;

  size: string;

  createdAt: string;

  width?: number;

  height?: number;

  thumbnail?: string;

  public static fromFileDto(dto: FileDto): FileDisplayDto {
    return {
      filename: dto.filename,
      mimeType: dto.mimeType,
      size: filesize(dto.sizeInBytes, { base: 2, standard: 'jedec' }),
      createdAt: DateTime.fromJSDate(dto.createdAt).toFormat('EEE dd MMM yyyy HH:mm:ss', { locale: LOCALE.luxon as string }),
      width: dto.width ?? null,
      height: dto.height ?? null,
      thumbnail: dto.thumbnail ?? null
    };
  }
}
