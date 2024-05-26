import { PaginationResolveService, PasswordCryptoService, PrismaService } from '@utils/services';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { SessionDto, SessionPayloadDto, SignInDto, SignUpDto } from '@admin/dto';
import { Request, Response } from 'express';
import { UserService as BackendUserService } from '@backend/services';
import { UserEditPage, UserEditPageFormMode, UserListPage } from '@admin/pages';
import { UserCreateDto, UserUpdateDto } from '@backend/dto/user';
import { validateNotEmptyPage } from '@utils/misc';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordCrypto: PasswordCryptoService,
    private readonly userService: BackendUserService,
    private readonly paginationResolve: PaginationResolveService
  ) {}

  public async findList(session: SessionPayloadDto, page = 0): Promise<UserListPage> {
    const users = await this.userService.findAll({}, this.paginationResolve.resolveTableSelection(page), { username: 'asc' });

    validateNotEmptyPage(users, page);

    return {
      session,
      maxPage: await this.userService.getMaxPageNumber({}),
      currentPage: page,
      users
    };
  }

  public async findForUpdateMyProfile(session: SessionPayloadDto): Promise<UserEditPage> {
    const user = await this.userService.findById(session.id);

    return {
      session,
      args: {
        formDescription: 'Edit my profile',
        formBackAddress: '/admin',
        formHandler: `/admin/staff/${session.id}`,
        formMode: UserEditPageFormMode.ME,
        formData: { ...user },
        formSubmit: 'Edit profile'
      }
    };
  }

  public getCreateForm(session: SessionPayloadDto): UserEditPage {
    return {
      session,
      args: {
        formDescription: 'Create new staff member',
        formBackAddress: '/admin/staff',
        formHandler: '/admin/staff/new',
        formMode: UserEditPageFormMode.CREATE,
        formData: null,
        formSubmit: 'Save changes'
      }
    };
  }

  public async findProfileForUpdate(id: string, session: SessionPayloadDto): Promise<UserEditPage> {
    const user = await this.userService.findById(id);

    return {
      session,
      args: {
        formDescription: `Edit profile of user: ${user.username}`,
        formBackAddress: '/admin/staff',
        formHandler: `/admin/staff/${id}`,
        formMode: UserEditPageFormMode.UPDATE,
        formData: { ...user },
        formSubmit: 'Save changes'
      }
    };
  }

  public async create(dto: UserCreateDto, res: Response): Promise<void> {
    const createdUser = await this.userService.create(dto);

    res.redirect(`/admin/staff/${createdUser.id}`);
  }

  public async updateMyProfile(dto: UserUpdateDto, session: SessionDto, res: Response): Promise<void> {
    const updatedUser = await this.userService.update(dto, session.payload.id);

    session.payload.username = updatedUser.username;
    session.payload.email = updatedUser.email;
    session.payload.role = updatedUser.role;
    session.payload.id = updatedUser.id;

    res.redirect('/admin/staff/me');
  }

  public async updateProfile(dto: UserUpdateDto, id: string, res: Response): Promise<void> {
    const updatedUser = await this.userService.update(dto, id);

    res.redirect(`/admin/staff/${updatedUser.id}`);
  }

  public async remove(id: string, res: Response): Promise<void> {
    await this.processLastAdminDeletionSecure(id);

    await this.userService.remove(id);

    res.redirect('/admin/staff');
  }

  public async signIn(dto: SignInDto, session: SessionDto, res: Response): Promise<void> {
    this.logger.log(`signIn ({dto: ${JSON.stringify(dto)}, session: ${JSON.stringify(session)})`);

    session.payload = await this.authorize(dto);

    res.redirect('/admin');
  }

  public async signUp(dto: SignUpDto, session: SessionDto, res: Response): Promise<void> {
    this.logger.log(`signUp ({dto: ${JSON.stringify(dto)}, session: ${JSON.stringify(session)})`);

    const userDto: UserCreateDto = new UserCreateDto();
    userDto.username = dto.username;
    userDto.email = dto.email;
    userDto.password = dto.password;
    userDto.role = UserRole.ADMINISTRATOR;

    const user = await this.userService.create(userDto);

    this.logger.log(`Object created: [User] {id: ${user.id}}`);

    await this.signIn({ username: user.username, password: dto.password }, session, res);
  }

  public signOut(req: Request, res: Response): void {
    this.logger.log(`signOut ({userId: ${req.session['payload']['id']})`);

    req.session.destroy(err => {
      if (err) {
        this.logger.error(err.message());
        throw new InternalServerErrorException(err);
      }
    });

    res.redirect('/admin/sign-in');
  }

  private async authorize(dto: SignInDto): Promise<SessionPayloadDto> {
    this.logger.log(`authorize ({dto: ${JSON.stringify(dto)})`);

    const failedMessage: string = 'The username or password you entered is incorrect.';

    const foundUser = await this.prisma.user.findFirst({ where: { username: dto.username } });

    if (!foundUser) {
      this.logger.warn(`${failedMessage}, dto: ${JSON.stringify(dto)}`);
      throw new UnauthorizedException(failedMessage);
    }

    const decryptedPassword = this.passwordCrypto.decrypt(foundUser.encryptedPassword);

    if (decryptedPassword !== dto.password) {
      this.logger.warn(`${failedMessage}, dto: ${JSON.stringify(dto)}`);
      throw new UnauthorizedException(failedMessage);
    }

    this.logger.log(`Authorized, dto: ${JSON.stringify(dto)}, userId: ${foundUser.id}`);

    return new SessionPayloadDto(foundUser.id, foundUser.username, foundUser.email, foundUser.role);
  }

  private async processLastAdminDeletionSecure(id: string): Promise<void> {
    const deleteCandidate = await this.userService.findEntityById(id);

    if (deleteCandidate.role === UserRole.ADMINISTRATOR) {
      const adminsCount = await this.prisma.user.count({ where: { role: UserRole.ADMINISTRATOR } });

      if (adminsCount === 1) {
        throw new BadRequestException('You cannot delete this user.');
      }
    }
  }
}
