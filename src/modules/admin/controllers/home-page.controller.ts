import { Controller, Get, Render, Req, Session, UseGuards } from '@nestjs/common';
import { SessionGuard } from '@admin/guards';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { HomeService } from '@admin/services';
import { HomePage } from '@admin/pages';
import { SessionDto } from '@admin/dto';
import { Request } from 'express';

@Controller('admin')
export class HomePageController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @Render('admin_home')
  public async homePage(@Session() session: SessionDto, @Req() req: Request): Promise<HomePage> {
    return await this.homeService.homePage(req, session.payload);
  }
}
