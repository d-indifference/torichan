import { Body, Controller, Get, Post, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { VolumeSettingsService } from '@utils//services';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { SessionDto, SpamInputDto, SpamOutputDto } from '@admin/dto';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('admin/spam')
export class SpamController {
  constructor(private readonly volumeSettingsService: VolumeSettingsService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_spam')
  public async getList(@Session() session: SessionDto): Promise<SpamOutputDto> {
    const spam = await this.volumeSettingsService.read('spam-list');

    return {
      session: session.payload,
      spam
    };
  }

  @Post()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async updateList(@Body(new ValidationPipe()) dto: SpamInputDto, @Res() res: Response): Promise<void> {
    await this.volumeSettingsService.write('spam-list', dto.spam);

    res.redirect('/admin/spam');
  }
}
