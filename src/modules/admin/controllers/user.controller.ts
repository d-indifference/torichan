import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Render, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from '@admin/services';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { SessionGuard } from '@admin/guards';
import { SessionDto } from '@admin/dto';
import { UserEditPage, UserListPage } from '@admin//pages';
import { FormDataRequest } from 'nestjs-form-data';
import { UserCreateDto, UserUpdateDto } from '@backend/dto/user';
import { Response } from 'express';
import { ParseOptionalPositiveNumberPipe } from '@utils/pipes';

@Controller('admin/staff')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_list-user')
  public async getStaffList(@Session() session: SessionDto, @Query('page', ParseOptionalPositiveNumberPipe) page = 0): Promise<UserListPage> {
    return await this.userService.findList(session.payload, page);
  }

  @Get('me')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @Render('admin_edit-user')
  public async getMyProfile(@Session() session: SessionDto): Promise<UserEditPage> {
    return await this.userService.findForUpdateMyProfile(session.payload);
  }

  @Post('me')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async editMyProfile(
    @Body(new ValidationPipe({ transform: true })) dto: UserUpdateDto,
    @Session() session: SessionDto,
    @Res() res: Response
  ): Promise<void> {
    await this.userService.updateMyProfile(dto, session, res);
  }

  @Get('new')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_edit-user')
  public getCreateEditPage(@Session() session: SessionDto): UserEditPage {
    return this.userService.getCreateForm(session.payload);
  }

  @Post('new')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async createUser(@Body(new ValidationPipe({ transform: true })) dto: UserCreateDto, @Res() res: Response): Promise<void> {
    await this.userService.create(dto, res);
  }

  @Get(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @Render('admin_edit-user')
  public async getUserEditPage(@Param('id', ParseUUIDPipe) id: string, @Session() session: SessionDto): Promise<UserEditPage> {
    return await this.userService.findProfileForUpdate(id, session.payload);
  }

  @Post(':id')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async editProfile(
    @Body(new ValidationPipe({ transform: true })) dto: UserUpdateDto,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response
  ): Promise<void> {
    await this.userService.updateProfile(dto, id, res);
  }

  @Post(':id/delete')
  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(SessionGuard)
  @FormDataRequest()
  public async removeUser(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response): Promise<void> {
    await this.userService.remove(id, res);
  }
}
