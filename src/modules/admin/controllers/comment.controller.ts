import { Controller, Get, Query, Render, Session, UseGuards } from '@nestjs/common';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { CommentListPage } from '@admin/pages';
import { CommentService } from '@admin/services';
import { SessionDto } from '@admin/dto';
import { ParseOptionalPositiveNumberPipe } from '@utils/pipes';

@Controller('admin/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @Render('admin_list-comment')
  public async getList(
    @Session() session: SessionDto,
    @Query('slug') slug?: string,
    @Query('page', ParseOptionalPositiveNumberPipe) page = 0
  ): Promise<CommentListPage> {
    return await this.commentService.findList(session.payload, slug, page);
  }
}
