import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { FileSystemService } from '@utils/services';
import { FileDto } from '@admin/dto';
import { imageMimeList } from '@utils/misc';
import sizeOf from 'image-size';
import * as mime from 'mime-types';
import { LOCALE } from '@utils/locale';

type ReadDirectoryResultType = {
  files: string[];

  currentPage: number;

  maxPage: number;
};

export type FileQueriesFindAllReturnType = {
  files: FileDto[];

  currentPage: number;

  maxPage: number;
};

@Injectable()
export class FileQueriesService {
  private readonly logger = new Logger(FileSystemService.name);

  constructor(private readonly fileSystem: FileSystemService) {}

  public async findAll(boardSlug: string, page = 0): Promise<FileQueriesFindAllReturnType> {
    this.logger.log(`findAll ({boardSlug: ${boardSlug}, page: ${page}})`);

    const srcDirectory = `${boardSlug}/src`;
    const thumbnailDirectory = `${boardSlug}/thumb`;

    await this.checkPathExists(srcDirectory);
    await this.checkPathExists(thumbnailDirectory);

    const srcDirectoryContains = await this.readDirectory(srcDirectory, page);

    const fileDtoList: FileDto[] = [];

    for (const file of srcDirectoryContains.files) {
      fileDtoList.push(await this.mapFileToDto(boardSlug, file));
    }

    return {
      files: fileDtoList,
      maxPage: srcDirectoryContains.maxPage,
      currentPage: srcDirectoryContains.currentPage
    };
  }

  public async remove(srcPath: string, thumbnailPath: string): Promise<void> {
    this.logger.log(`remove ({srcPath: ${srcPath}, thumbnailPath: ${thumbnailPath}})`);

    if (thumbnailPath) {
      await this.fileSystem.removePath(thumbnailPath);
    }

    await this.fileSystem.removePath(srcPath);
  }

  private async readDirectory(directory: string, currentPage: number): Promise<ReadDirectoryResultType> {
    const allFiles = await this.fileSystem.readDir(directory);
    const maxPage = Math.floor(allFiles.length / 10);
    const files = allFiles.slice(currentPage * 10, 10);

    if (currentPage > 0 && files.length === 0) {
      throw new NotFoundException(LOCALE.admin['pageWasNotFound'](currentPage));
    }

    return { currentPage, maxPage, files };
  }

  private async mapFileToDto(boardSlug: string, file: string): Promise<FileDto> {
    const fullSrcPath = `${boardSlug}/src/${file}`;
    const fullFilePath = this.fileSystem.buildFullPath(fullSrcPath);
    const fileStats: fsSync.Stats = await fs.stat(fullFilePath);

    const mimeType = mime.lookup(fullSrcPath);

    if (!mimeType) {
      throw new NotFoundException(LOCALE.admin['fileWasNotFound'](fullSrcPath));
    }

    const dto: FileDto = {
      filename: fullSrcPath,
      mimeType: mimeType as string,
      sizeInBytes: fileStats.size,
      createdAt: fileStats.ctime
    };

    if (imageMimeList.indexOf(dto.mimeType) !== -1) {
      const dimensions = sizeOf(fullFilePath);
      dto.width = dimensions.width;
      dto.height = dimensions.height;
      dto.thumbnail = `${boardSlug}/thumb/${file.split('.')[0]}s.jpg`;
    }

    return dto;
  }

  private async checkPathExists(pathToDir: string): Promise<void> {
    const exists = await this.fileSystem.isPathExists(pathToDir);

    if (!exists) {
      const message = LOCALE.admin['directoryNotExists'](pathToDir);
      this.logger.warn(message);
      throw new NotFoundException(message);
    }
  }
}
