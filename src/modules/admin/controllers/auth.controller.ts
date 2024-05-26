import { Body, Controller, Get, Post, Render, Req, Res, Session, UseGuards, ValidationPipe } from '@nestjs/common';
import { SessionGuard, SignInPageGuard, SignUpPageGuard } from '@admin/guards';
import { Roles } from '@admin/decorators';
import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { UserService } from '@admin/services';
import { FormDataRequest } from 'nestjs-form-data';
import { SessionDto, SignInDto, SignUpDto } from '@admin/dto';

@Controller('admin')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('sign-in')
  @UseGuards(SignInPageGuard)
  @Render('admin_sign-in')
  public getSignInPage(): void {}

  @Post('sign-in')
  @UseGuards(SignInPageGuard)
  @FormDataRequest()
  public async signIn(
    @Body(new ValidationPipe({ transform: true })) dto: SignInDto,
    @Session() session: SessionDto,
    @Res() res: Response
  ): Promise<void> {
    await this.userService.signIn(dto, session, res);
  }

  @Post('sign-out')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MODERATOR)
  @UseGuards(SessionGuard)
  public signOut(@Req() req: Request, @Res() res: Response): void {
    this.userService.signOut(req, res);
  }

  @Get('sign-up')
  @UseGuards(SignUpPageGuard)
  @Render('admin_sign-up')
  public getSignUpPage(): void {}

  @Post('sign-up')
  @UseGuards(SignUpPageGuard)
  @FormDataRequest()
  public async signUp(
    @Body(new ValidationPipe({ transform: true })) dto: SignUpDto,
    @Session() session: SessionDto,
    @Res() res: Response
  ): Promise<void> {
    await this.userService.signUp(dto, session, res);
  }
}
