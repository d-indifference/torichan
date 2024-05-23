/* eslint-disable prettier/prettier  */

import { Injectable } from '@nestjs/common';
import { PackageJsonDto, SessionPayloadDto, TechnicalInfoDto } from '@admin/dto';
import { HomePage } from '@admin/pages';
import { FileSystemService, PrismaService } from '@utils/services';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as process from 'node:process';
import { filesize } from 'filesize';
import * as os from 'node:os';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import * as fsExtra from 'fs-extra';

@Injectable()
export class HomeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly fileSystem: FileSystemService
  ) {}

  public async homePage(req: Request, session: SessionPayloadDto): Promise<HomePage> {
    return HomePage
      .builder()
      .session(session)
      .technicalInfo(await this.collectTechnicalInfo(req))
      .build();
  }

  private async collectTechnicalInfo(req: Request): Promise<TechnicalInfoDto> {
    const totalBoards = await this.prisma.board.count();
    const totalComments = await this.prisma.comment.count();

    const fileDir = this.config.getOrThrow('paths.files');
    const fullFilesPath = path.join(process.cwd(), fileDir);

    const diskSpaceUsed = this.parseFileSize(await this.fileSystem.dirSize(fullFilesPath));

    const totalmem = os.totalmem();
    const freeMem = os.freemem();

    const port = parseInt(req.headers.host.split(':')[1]);

    const packageJson = await this.readPackageJson();

    const dto = new TechnicalInfoDto();
    dto.diskSpaceUsed = diskSpaceUsed;
    dto.totalComments = totalComments;
    dto.totalBoards = totalBoards;
    dto.uptime = os.uptime();
    dto.cpus = os.cpus();
    dto.memory = { total: this.parseFileSize(totalmem), free: this.parseFileSize(freeMem), inUsage: this.parseFileSize(totalmem - freeMem) };
    dto.port = port;
    dto.debugPort = process.debugPort;
    dto.host = os.hostname();
    dto.processVersions = process.versions;
    dto.postgresVersion = await this.getPostgresVersion();
    dto.dependencies = packageJson.dependencies;
    dto.devDependencies = packageJson.devDependencies;

    return dto;
  }

  private async getPostgresVersion(): Promise<string> {
    const postgresVersionQuery = await this.prisma.$queryRaw(
      Prisma.sql`SELECT VERSION();`
    );

    return postgresVersionQuery[0]['version'];
  }

  private parseFileSize(byteCount: number): string {
    return filesize(byteCount, { base: 2, standard: 'jedec' });
  }

  private async readPackageJson(): Promise<PackageJsonDto> {
    const pathToPackageJson = path.join(process.cwd(), 'package.json');

    const packageData = await fsExtra.readFile(pathToPackageJson);
    const packageObject = JSON.parse(packageData.toString());

    return packageObject as PackageJsonDto;
  }

  public async getDependencies(): Promise<Pick<PackageJsonDto, 'dependencies' | 'devDependencies'>> {
    const packageJson = await this.readPackageJson();

    return {
      dependencies: packageJson.dependencies,
      devDependencies: packageJson.devDependencies
    };
  }
}
