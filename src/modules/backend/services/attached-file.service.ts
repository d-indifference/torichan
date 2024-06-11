/* eslint-disable prettier/prettier  */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FileSystemService, PrismaService } from '@utils/services';
import { AttachedFile, Prisma } from '@prisma/client';
import { CommentCreateDto } from '@backend/dto/comment';
import { DateTime } from 'luxon';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fs from 'fs/promises';
import sizeOf from 'image-size';
import * as sharp from 'sharp';
import * as process from 'process';
import * as path from 'path';
import * as fsExtra from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { imageMimeList } from '@utils/misc';

@Injectable()
export class AttachedFileService {
  private readonly logger: Logger = new Logger(AttachedFileService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly fileSystem: FileSystemService,
    private readonly prisma: PrismaService,
  ) {}

  public async findOne(where: Prisma.AttachedFileWhereInput): Promise<AttachedFile> {
    this.logger.log(`findOne ({where: ${JSON.stringify(where)}})`);

    const attachedFile = await this.findOneExact(where);

    if (!attachedFile) {
      const message: string = 'Attached file was not found';
      this.logger.warn(`${message}, condition: ${JSON.stringify(where)}`);
      throw new NotFoundException(message);
    }

    return attachedFile;
  }

  public async findOneExact(where: Prisma.AttachedFileWhereInput): Promise<AttachedFile> {
    this.logger.log(`findByIdExact ({where: ${JSON.stringify(where)}})`);

    return (await this.prisma.attachedFile.findFirst({ where, include: { comment: true } })) as AttachedFile;
  }

  public async saveFile(board: string, dto: CommentCreateDto): Promise<AttachedFile> {
    this.logger.log(`saveFile ({board: ${board}), dto: ${dto.file ? dto.file.path : null}}`);

    const newFileName = DateTime.local().toMillis();

    const newAttachedFileTemplate: Record<string, unknown> = {};

    const fileSource = await this.fileSystem.saveFileFromFormData(`${board}/src`, dto.file, `${newFileName}`);

    this.logger.log(`File saved { filename: ${fileSource.filename}, fullPath: ${fileSource.fullPath} }`);

    if (fileSource.filename) {
      newAttachedFileTemplate['path'] = fileSource.filename;
      newAttachedFileTemplate['size'] = (await fs.stat(fileSource.fullPath)).size;

      if (this.checkIfAttachedImage(dto.file)) {
        const dimensions = sizeOf(fileSource.fullPath);
        newAttachedFileTemplate['width'] = dimensions.width;
        newAttachedFileTemplate['height'] = dimensions.height;
        newAttachedFileTemplate['isImage'] = true;

        const thumbnail = await this.createThumbnail(board, dto.file, `${newFileName}`, dimensions.width, dimensions.height);
        newAttachedFileTemplate['thumbnailPath'] = thumbnail.thumbnailPath;
        newAttachedFileTemplate['thumbnailWidth'] = thumbnail.thumbnailWidth;
        newAttachedFileTemplate['thumbnailHeight'] = thumbnail.thumbnailHeight;
      } else {
        newAttachedFileTemplate['isImage'] = false;
      }

      newAttachedFileTemplate['mimeType'] = dto.file.mimeType;

      const newAttachedFileCreateInput: Prisma.AttachedFileCreateInput = {
        path: newAttachedFileTemplate['path'] as string,
        size: newAttachedFileTemplate['size'] as number,
        width: (newAttachedFileTemplate['width'] as number) ?? null,
        height: (newAttachedFileTemplate['height'] as number) ?? null,
        mimeType: newAttachedFileTemplate['mimeType'] as string,
        thumbnailPath: (newAttachedFileTemplate['thumbnailPath'] as string) ?? null,
        thumbnailWidth: (newAttachedFileTemplate['thumbnailWidth'] as number) ?? null,
        thumbnailHeight: (newAttachedFileTemplate['thumbnailHeight'] as number) ?? null,
        isImage: newAttachedFileTemplate['isImage'] as boolean
      };

      const newAttachedFile = await this.prisma.attachedFile.create({ data: newAttachedFileCreateInput });

      this.logger.log(`Object created: [AttachedFile] {id: ${newAttachedFile.id}}`);

      return newAttachedFile;
    }

    return null;
  }

  public checkIfAttachedImage(file: FileSystemStoredFile): boolean {
    return imageMimeList.indexOf(file.mimeType) !== -1;
  }

  public async removeEntity(attachedFile: AttachedFile): Promise<void> {
    this.logger.log(`removeEntity ({attachedFile: ${JSON.stringify(attachedFile)})`);

    const { filePathSrc, filePathThumb } = await this.makeFilePaths(attachedFile);

    await this.fileSystem.removePath(filePathSrc);

    if (filePathThumb) {
      await this.fileSystem.removePath(filePathThumb);
    }

    await this.prisma.attachedFile.delete({ where: { id: attachedFile.id } });
  }

  public async remove(where: Prisma.AttachedFileWhereInput): Promise<void> {
    this.logger.log(`remove ({where: ${JSON.stringify(where)}})`);

    const attachedFile = await this.findOne(where);

    await this.removeEntity(attachedFile);
  }

  public async removeIfFound(where: Prisma.AttachedFileWhereInput): Promise<void> {
    this.logger.log(`removeIfFound ({where: ${JSON.stringify(where)}})`);

    const attachedFile = await this.findOneExact(where);

    if (attachedFile) {
      await this.removeEntity(attachedFile);
    }
  }

  private async makeFilePaths(attachedFile: AttachedFile): Promise<{ filePathSrc: string, filePathThumb?: string }> {
    this.logger.log(`makeFilePaths ({attachedFile: ${JSON.stringify(attachedFile)})`);

    const fileCommentWithBoard = await this.prisma.comment.findFirst({ where: { id: attachedFile.commentId }, include: { board: true } });
    const filePathSrc = `${fileCommentWithBoard.board.slug}/src/${attachedFile.path}`;

    let filePathThumb: string | undefined;

    if (attachedFile.thumbnailPath) {
      filePathThumb = `${fileCommentWithBoard.board.slug}/thumb/${attachedFile.thumbnailPath}`;
    }

    return { filePathSrc, filePathThumb };
  }

  private async createThumbnail(
    board: string,
    file: FileSystemStoredFile,
    fileName: string,
    sourceWidth: number,
    sourceHeight: number
  ): Promise<{ thumbnailPath: string; thumbnailWidth: number; thumbnailHeight: number }> {
    this.logger.log(`createThumbnail ({board: ${board}, file: ${file.path}, fileName: ${fileName}, sourceWidth: ${sourceWidth}, sourceHeight: ${sourceHeight}})`);
    const filesStoragePath = this.config.getOrThrow('paths.files');

    const thumbnailName = `${fileName}s`;
    const thumbnailPath = `${board}/thumb`;
    const fullThumbPath = path.join(process.cwd(), filesStoragePath, thumbnailPath);
    const sourcePath = path.join(process.cwd(), filesStoragePath, board, `src/${fileName}${path.extname(file.path)}`);

    await fsExtra.ensureDir(fullThumbPath);

    const thumbnailNameWithExt = `${thumbnailName}.jpg`;

    const thumbnailSide = this.config.getOrThrow<number>('constants.thumbnail.side');

    if (sourceWidth <= thumbnailSide && sourceHeight <= thumbnailSide) {
      await this.saveThumbnail(sourcePath, path.join(fullThumbPath, thumbnailNameWithExt), sourceWidth, sourceHeight);

      const result = { thumbnailPath: thumbnailNameWithExt, thumbnailHeight: sourceHeight, thumbnailWidth: sourceWidth };
      this.logger.log(`Thumbnail saved { result: ${JSON.stringify(result)} }`);

      return result;
    }

    if (sourceWidth < sourceHeight) {
      const thumbnailWidth = Math.floor((sourceWidth * thumbnailSide) / sourceHeight);

      await this.saveThumbnail(sourcePath, path.join(fullThumbPath, thumbnailNameWithExt), thumbnailWidth, thumbnailSide);

      const result = { thumbnailPath: thumbnailNameWithExt, thumbnailHeight: thumbnailSide, thumbnailWidth };
      this.logger.log(`Thumbnail saved { result: ${JSON.stringify(result)} }`);

      return result;
    } else if (sourceWidth > sourceHeight) {
      const thumbnailHeight = Math.floor((sourceHeight * thumbnailSide) / sourceWidth);

      await this.saveThumbnail(sourcePath, path.join(fullThumbPath, thumbnailNameWithExt), thumbnailSide, thumbnailHeight);

      const result = { thumbnailPath: thumbnailNameWithExt, thumbnailHeight, thumbnailWidth: thumbnailSide };
      this.logger.log(`Thumbnail saved { result: ${JSON.stringify(result)} }`);

      return result;
    }

    await this.saveThumbnail(sourcePath, path.join(fullThumbPath, thumbnailNameWithExt), thumbnailSide, thumbnailSide);

    const result = { thumbnailPath: thumbnailNameWithExt, thumbnailHeight: thumbnailSide, thumbnailWidth: thumbnailSide };
    this.logger.log(`Thumbnail saved { result: ${JSON.stringify(result)} }`);

    return result;
  }

  private async saveThumbnail(sourcePath: string, targetPath: string, width: number, height: number): Promise<void> {
    this.logger.log(`saveThumbnail ({sourcePath: ${sourcePath}, targetPath: ${targetPath}, width: ${width}, height: ${height})`);

    await sharp(sourcePath, { failOn: 'truncated' })
      .resize({ fit: 'contain', width, height })
      .jpeg({ quality: 80 })
      .toFile(targetPath);
  }
}
