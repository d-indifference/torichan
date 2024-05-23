import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
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

  public async renameDir(dirPath: string, newName: string): Promise<void> {
    const oldFullPath = this.buildFullPath(dirPath);
    const newFullPath = this.buildFullPath(newName);

    await fs.rename(oldFullPath, newFullPath);
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

  public async dirSize(dirPath: string): Promise<number> {
    if (fsSync.existsSync(dirPath)) {
      const stat = await fs.stat(dirPath);

      if (stat.isDirectory()) {
        let totalSize = 0;

        const dirSizeRecursive = async (dirPath: string): Promise<void> => {
          const stat = await fs.stat(dirPath);

          if (stat.isDirectory()) {
            const files = await fs.readdir(dirPath);

            for (const file of files) {
              await dirSizeRecursive(path.join(dirPath, file));
            }
          } else {
            totalSize += stat.size;
          }
        };

        await dirSizeRecursive(dirPath);

        return totalSize;
      }
    }

    return 0;
  }
}
