import { Body, Controller, Get, Post, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { GlobalSettingsDto, SessionDto } from '@admin/dto';
import { EditPage, EditPageFormArgsMode } from '@admin/pages';
import { GlobalSettingsService } from '@admin/services';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('admin/global-settings')
export class GlobalSettingsController {
  constructor(private readonly globalSettingsService: GlobalSettingsService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_global-settings')
  public async getGlobalSettingsForm(@Session() session: SessionDto): Promise<EditPage<GlobalSettingsDto>> {
    return {
      session: session.payload,
      args: {
        formDescription: 'Global site settings',
        formHandler: '/admin/global-settings',
        formData: await this.globalSettingsService.get(),
        formMode: EditPageFormArgsMode.UPDATE
      }
    };
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async updateGlobalSettings(@Body(new ValidationPipe({ transform: true })) dto: GlobalSettingsDto, @Res() res: Response): Promise<void> {
    await this.globalSettingsService.update(dto);

    res.redirect('/admin/global-settings');
  }
}
