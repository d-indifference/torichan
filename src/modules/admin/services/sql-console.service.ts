import { BadRequestException, Injectable, Logger, StreamableFile } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { Response } from 'express';

@Injectable()
export class SqlConsoleService {
  private readonly logger: Logger = new Logger(SqlConsoleService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async runQuery(query: string): Promise<unknown> {
    try {
      this.logger.log(`runQuery (query: {${query}})`);

      return (await this.prisma.$queryRawUnsafe(query)) as unknown;
    } catch (e) {
      this.logger.warn(e.message);
      throw new BadRequestException(e.message);
    }
  }

  public async saveToFile(query: string, res: Response): Promise<StreamableFile> {
    this.logger.log(`saveToFile (query: {${query}})`);

    const queryResult = await this.runQuery(query);

    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${new Date().getTime()}.json"`
    });

    const fileBuffer = Buffer.from(JSON.stringify(queryResult), 'utf-8');

    return new StreamableFile(fileBuffer);
  }
}
