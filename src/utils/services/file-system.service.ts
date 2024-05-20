import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsExtra from 'fs-extra';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import { FileSavingResult } from '@utils/types';

@Injectable()
export class FileSystemService {
  private readonly baseStoragePath: string;

  private readonly logger = new Logger(FileSystemService.name);

  constructor(private readonly config: ConfigService) {
    const filesDirectory = this.config.getOrThrow('paths.files');

    this.baseStoragePath = path.join(process.cwd(), filesDirectory);
  }

  public buildFullPath(dirPath: string): string {
    return path.join(this.baseStoragePath, dirPath);
  }

  public async saveFileFromFormData(dirPath: string, file: FileSystemStoredFile, name?: string): Promise<FileSavingResult> {
    if (!file) {
      return { filename: null, fullPath: null };
    }

    this.logger.log(`File will be saved { dirPath: ${dirPath}, file: ${file.path} }`);

    const fullPath = this.buildFullPath(dirPath);
    await fsExtra.ensureDir(fullPath);

    let fullFilePath: string;
    let filename: string;

    if (name) {
      const extname = path.extname(file.path);

      filename = `${name}${extname}`;
      fullFilePath = path.join(fullPath, filename);

      await fsExtra.move(file.path, fullFilePath, { overwrite: false });
    } else {
      filename = path.basename(file.path);
      fullFilePath = path.join(fullPath, filename);

      await fsExtra.move(file.path, fullFilePath);
    }

    this.logger.log(`File saved { path: ${fullFilePath} }`);

    return { filename, fullPath: fullFilePath };
  }

  public async readDir(dirPath: string): Promise<string[]> {
    const fullPath = this.buildFullPath(dirPath);

    return await fs.readdir(fullPath);
  }

  public async isPathExists(fileSystemPath: string): Promise<boolean> {
    const fullPath = this.buildFullPath(fileSystemPath);

    try {
      await fs.access(fullPath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public async ensureDir(dirPath: string): Promise<void> {
    const fullPath = this.buildFullPath(dirPath);

    await fsExtra.ensureDir(fullPath);
  }

  public async removePath(fileSystemPath: string): Promise<void> {
    const fullPath = this.buildFullPath(fileSystemPath);

    if (await this.isPathExists(fileSystemPath)) {
      await fsExtra.remove(fullPath);

      this.logger.log(`Path removed: ${fileSystemPath}`);
    } else {
      this.logger.warn(`Path not removed: ${fileSystemPath}`);
    }
  }
}
