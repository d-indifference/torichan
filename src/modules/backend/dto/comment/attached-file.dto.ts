import { AttachedFile } from '@prisma/client';
import { filesize } from 'filesize';

export class AttachedFileDto {
  id: string;

  path: string;

  size: string;

  isImage: boolean;

  mimeType: string;

  width?: number;

  height?: number;

  thumbnailPath?: string;

  thumbnailWidth?: number;

  thumbnailHeight?: number;

  constructor(
    id: string,
    path: string,
    size: string,
    isImage: boolean,
    mimeType: string,
    width: number,
    height: number,
    thumbnailPath: string,
    thumbnailWidth: number,
    thumbnailHeight: number
  ) {
    this.id = id;
    this.path = path;
    this.size = size;
    this.isImage = isImage;
    this.mimeType = mimeType;
    this.width = width;
    this.height = height;
    this.thumbnailPath = thumbnailPath;
    this.thumbnailWidth = thumbnailWidth;
    this.thumbnailHeight = thumbnailHeight;
  }

  public static fromModel(model: AttachedFile): AttachedFileDto {
    if (!model) {
      return null;
    }

    return new AttachedFileDto(
      model.id,
      model.path,
      filesize(model.size, { standard: 'jedec' }),
      model.isImage,
      model.mimeType,
      model.width,
      model.height,
      model.thumbnailPath,
      model.thumbnailWidth,
      model.thumbnailHeight
    );
  }
}
