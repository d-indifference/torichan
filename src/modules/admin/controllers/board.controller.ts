import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { BoardService } from '@admin/services';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { SessionDto } from '@admin/dto';
import { BoardListPage, EditPage, EditPageFormArgsMode } from '@admin/pages';
import { BoardCreateDto, BoardDto, BoardUpdateDto } from '@backend/dto/board';
import { FormDataRequest } from 'nestjs-form-data';
import { ParseOptionalPositiveNumberPipe } from '@utils/pipes';
import { Response } from 'express';

@Controller('admin/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_list-board')
  public async getList(@Session() session: SessionDto, @Query('page', ParseOptionalPositiveNumberPipe) page = 0): Promise<BoardListPage> {
    return await this.boardService.findList(session.payload, page);
  }

  @Get('new')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_edit-board')
  public getFormBoardCreation(@Session() session: SessionDto): EditPage<BoardDto> {
    return {
      session: session.payload,
      args: {
        formDescription: 'Create new board',
        formHandler: '/admin/board/new',
        formMode: EditPageFormArgsMode.CREATE,
        formData: null
      }
    };
  }

  @Post('new')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async createBoard(@Body(new ValidationPipe({ transform: true })) dto: BoardCreateDto, @Res() res: Response): Promise<void> {
    await this.boardService.create(dto, res);
  }

  @Get(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_edit-board')
  public async getBoardForUpdate(@Session() session: SessionDto, @Param('id', ParseUUIDPipe) id: string): Promise<EditPage<BoardUpdateDto>> {
    return await this.boardService.findById(session.payload, id);
  }

  @Post(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async updateBoard(
    @Body(new ValidationPipe({ transform: true })) dto: BoardUpdateDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.boardService.update(dto, id, res);
  }

  @Post(':id/delete')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  public async deleteBoard(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response): Promise<void> {
    await this.boardService.remove(id, res);
  }
}
