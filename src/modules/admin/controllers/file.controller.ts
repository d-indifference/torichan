import { Body, Controller, Get, Post, Query, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { FileService } from '@admin/services';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { FileListPage } from '@admin/pages';
import { FileRemoveDto, SessionDto } from '@admin/dto';
import { ParseOptionalPositiveNumberPipe } from '@utils/pipes';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';

@Controller('admin/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_list-file')
  public async getList(
    @Session() session: SessionDto,
    @Query('slug') slug?: string,
    @Query('page', ParseOptionalPositiveNumberPipe) page = 0
  ): Promise<FileListPage> {
    return await this.fileService.findAll(session.payload, slug, page);
  }

  @Post('delete')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async removeFile(@Body(new ValidationPipe({ transform: true })) dto: FileRemoveDto, @Res() res: Response): Promise<void> {
    await this.fileService.remove(dto, res);
  }
}
