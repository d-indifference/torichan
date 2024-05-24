import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@utils/services';

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
}
