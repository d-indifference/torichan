import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { PrismaTakeSkipDto } from '@utils/misc';
import { Ban, Prisma } from '@prisma/client';
import { BanCreateDto, BanDto, BanDurationType } from '@backend/dto/ban';
import { UserService } from '@backend/services/user.service';
import { DateTime, DurationLike } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { LOCALE } from '@utils/locale';

@Injectable()
export class BanService {
  private readonly logger = new Logger(BanService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly config: ConfigService
  ) {}

  public async findAll(
    where: Prisma.BanWhereInput,
    selection?: PrismaTakeSkipDto,
    orderBy?: Prisma.BanOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[]
  ): Promise<BanDto[]> {
    this.logger.log(
      `findAll ({where: ${JSON.stringify(where)}, selection: ${selection ? selection.toString() : ''}, orderBy: ${JSON.stringify(orderBy)}})`
    );

    const bans = await this.prisma.ban.findMany({ where, ...selection, orderBy, include: { user: true } });

    return bans.map(ban => BanDto.fromModel(ban));
  }

  public async findLastBanByIp(ip: string): Promise<BanDto> {
    this.logger.log(`findLastBanByIp ({ip: ${ip})`);

    const ban = await this.prisma.ban.findFirst({ where: { ip }, orderBy: { createdAt: 'desc' } });

    return ban ? BanDto.fromModel(ban) : null;
  }

  public async getMaxPageNumber(where: Prisma.BanWhereInput): Promise<number> {
    const pageSize = this.config.getOrThrow<number>('constants.pagination.default.table-contains');

    const count = await this.prisma.ban.count({ where });

    return Math.floor(count / pageSize);
  }

  public async create(dto: BanCreateDto, userId: string): Promise<Ban> {
    this.logger.log(`create ({dto: ${JSON.stringify(dto)}, userId: ${userId})`);

    const user = await this.userService.findById(userId);

    const newBan = await this.prisma.ban.create({ data: this.toBanCreateInput(dto, user.id) });

    this.logger.log(`Object created: [Ban] {id: ${newBan.id}}`);

    await this.rotateBans();

    return newBan;
  }

  public async checkActiveBan(ip: string): Promise<void> {
    this.logger.log(`checkActiveBan ({ip: ${ip})`);

    const now = new Date();

    const ban = await this.prisma.ban.findFirst({ where: { ip, till: { gt: now } }, orderBy: { createdAt: 'desc' }, include: { user: true } });

    if (ban) {
      const banDto = BanDto.fromModel(ban);
      const displayMessage: string = `${LOCALE.backend['youAreBanned'](banDto.till)}.<br>${LOCALE.backend['reason']} ${banDto.reason}`;

      this.logger.warn(`IP banned ({ip: ${ip}, till: ${banDto.till})`);
      throw new ForbiddenException(displayMessage);
    }
  }

  public async rotateBans(): Promise<void> {
    this.logger.log('rotateBans ()');

    const now = new Date();

    await this.prisma.ban.deleteMany({ where: { till: { lt: now } } });
  }

  public async remove(id: string): Promise<void> {
    this.logger.log(`remove({id: ${id})`);

    const ban = await this.prisma.ban.findFirst({ where: { id } });

    if (!ban) {
      const message: string = LOCALE.backend['banWasNotFound'](id);
      this.logger.warn(message);
      throw new NotFoundException(`${message}.`);
    }

    await this.prisma.ban.delete({ where: { id: ban.id } });
  }

  private toBanCreateInput(dto: BanCreateDto, userId: string): Prisma.BanCreateInput {
    return {
      ip: dto.ip,
      till: this.buildBanTillDate(dto),
      reason: dto.reason,
      user: { connect: { id: userId } }
    };
  }

  private buildBanTillDate(dto: BanCreateDto): Date {
    const now = DateTime.now();
    const till = parseInt(dto.till);

    const processingMethods: Record<BanDurationType, DurationLike> = {
      MINUTES: { minutes: till },
      HOURS: { hours: till },
      DAYS: { days: till },
      MONTHS: { months: till },
      YEARS: { years: till }
    };

    return now.plus(processingMethods[dto.durationType]).toJSDate();
  }
}
