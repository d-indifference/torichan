import { Body, Controller, Get, Param, Post, Query, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { FormDataRequest } from 'nestjs-form-data';
import { Response } from 'express';
import { RemoveCommentDto, SessionDto } from '@admin/dto';
import { ExtractCommentRemovePayloadPipe } from '@admin/pipes';
import { BanService, CommentService } from '@admin/services';
import { BanListPage } from '@admin/pages';
import { ParseOptionalPositiveNumberPipe } from '@utils/pipes';
import { BanCreateDto } from '@backend/dto/ban';

@Controller('admin/ban')
export class BanController {
  constructor(
    private readonly commentService: CommentService,
    private readonly banService: BanService
  ) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @Render('admin_list-ban')
  public async getList(@Session() session: SessionDto, @Query('page', ParseOptionalPositiveNumberPipe) page = 0): Promise<BanListPage> {
    return await this.banService.findList(session.payload, page);
  }

  @Get('new')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @Render('admin_edit-ban')
  public getNewBanForm(@Session() session: SessionDto, @Query('ip') ip?: string): unknown {
    return {
      session: session.payload,
      ip
    };
  }

  @Post('new')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async createBan(
    @Body(new ValidationPipe({ transform: true })) dto: BanCreateDto,
    @Session() session: SessionDto,
    @Res() res: Response
  ): Promise<void> {
    await this.banService.create(session.payload, dto, res);
  }

  @Post(':id/delete')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async removeBan(@Param(':id') id: string, @Res() res: Response): Promise<void> {
    await this.banService.remove(id, res);
  }

  @Post('remove-comment')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async removeComment(
    @Body(ExtractCommentRemovePayloadPipe, new ValidationPipe({ transform: true })) dto: RemoveCommentDto,
    @Res() res: Response
  ): Promise<void> {
    await this.commentService.removeComment(dto, res);
  }
}
