import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'node:process';
import * as fsExtra from 'fs-extra';

@Injectable()
export class VolumeSettingsService {
  private readonly logger: Logger = new Logger(VolumeSettingsService.name);

  constructor(private readonly configService: ConfigService) {}

  public async create(fileName: string): Promise<void> {
    this.logger.log(`create ({fileName: ${fileName}})`);

    const pathToVolume = this.pathToVolume();

    await fsExtra.ensureDir(pathToVolume);

    const fullPathToFile = path.join(pathToVolume, fileName);

    if (!(await this.checkIfFileExists(fileName))) {
      await fs.writeFile(fullPathToFile, '', { encoding: 'utf8' });
    }
  }

  public async write(fileName: string, content: string): Promise<void> {
    this.logger.log(`write ({fileName: ${fileName}, content: ${content}})`);

    const fullPathToFile = path.join(this.pathToVolume(), fileName);

    if (await this.checkIfFileExists(fileName)) {
      await fs.writeFile(fullPathToFile, content, { encoding: 'utf8' });
    }
  }

  public async read(fileName: string): Promise<string> {
    this.logger.log(`read ({fileName: ${fileName}})`);

    const fullPathToFile = path.join(this.pathToVolume(), fileName);

    if (await this.checkIfFileExists(fileName)) {
      return (await fs.readFile(fullPathToFile, { encoding: 'utf8' })).toString();
    }
  }

  private pathToVolume(): string {
    return path.join(process.cwd(), this.configService.getOrThrow('paths.volume'));
  }

  public async checkIfFileExists(fileName: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.pathToVolume(), fileName), fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
}
