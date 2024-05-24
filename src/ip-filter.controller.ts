import { Body, Controller, Get, Post, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { IpFilterUpdateDto, SessionDto } from '@admin/dto';
import { IpFilterPage } from '@admin/pages';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';
import { IpListFilesService } from './ip-list-files.service';
import { lineBrokenStringToArray } from '@utils/misc';

@Controller('admin/filter')
export class IpFilterController {
  constructor(private readonly ipListFilesService: IpListFilesService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_ip-filter')
  public async getIpFilterForm(@Session() session: SessionDto): Promise<IpFilterPage> {
    return {
      session: session.payload,
      whiteList: (await this.ipListFilesService.getIpWhiteList()).join('\r\n'),
      blackList: (await this.ipListFilesService.getIpBlackList()).join('\r\n')
    };
  }

  @Post('whitelist')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async updateWhiteList(@Body(new ValidationPipe()) dto: IpFilterUpdateDto, @Res() res: Response): Promise<void> {
    await this.ipListFilesService.setIpWhiteList(lineBrokenStringToArray(dto.ipList));

    res.redirect('/admin/filter');
  }

  @Post('blacklist')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async updateBlackList(@Body(new ValidationPipe()) dto: IpFilterUpdateDto, @Res() res: Response): Promise<void> {
    await this.ipListFilesService.setIpBlackList(dto.mapListToArray());

    res.redirect('/admin/filter');
  }
}
