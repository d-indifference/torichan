import { Injectable } from '@nestjs/common';
import { BanService as BackendBanService } from '@backend/services';
import { SessionPayloadDto } from '@admin/dto';
import { BanListPage } from '@admin/pages';
import { PaginationResolveService } from '@utils/services';
import { BanCreateDto } from '@backend/dto/ban';
import { Response } from 'express';

@Injectable()
export class BanService {
  constructor(
    private readonly banService: BackendBanService,
    private readonly pageResolve: PaginationResolveService
  ) {}

  public async findList(session: SessionPayloadDto, page = 0): Promise<BanListPage> {
    const bans = await this.banService.findAll({}, this.pageResolve.resolveTableSelection(page), { createdAt: 'desc' });

    return {
      currentPage: page,
      maxPage: await this.banService.getMaxPageNumber({}),
      session,
      bans
    };
  }

  public async create(session: SessionPayloadDto, dto: BanCreateDto, res: Response): Promise<void> {
    await this.banService.create(dto, session.id);

    res.redirect('/admin/ban');
  }

  public async remove(id: string, res: Response): Promise<void> {
    await this.banService.remove(id);

    res.redirect('/admin/ban');
  }
}
