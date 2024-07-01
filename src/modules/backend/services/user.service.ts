import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PasswordCryptoService, PrismaService } from '@utils/services';
import { UserCreateDto, UserDto, UserUpdateDto } from '@backend/dto/user';
import { Prisma, User } from '@prisma/client';
import { PrismaTakeSkipDto } from '@utils/misc';
import { ConfigService } from '@nestjs/config';
import { LOCALE } from '@utils/locale';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordCrypto: PasswordCryptoService,
    private readonly config: ConfigService
  ) {}

  public async findAll(
    where: Prisma.UserWhereInput,
    selection?: PrismaTakeSkipDto,
    orderBy?: Prisma.UserOrderByWithRelationInput
  ): Promise<UserDto[]> {
    this.logger.log(`findAll ({where: ${JSON.stringify(where)}, selection: ${selection.toString()}, orderBy: ${JSON.stringify(orderBy)}})`);

    const users = await this.prisma.user.findMany({ where, ...selection, orderBy });

    return users.map(user => UserDto.fromModel(user));
  }

  public async findEntityById(id: string): Promise<User> {
    this.logger.log(`findEntityById ({id: ${id})`);

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      const message = LOCALE.backend['userWasNotFound'](id);
      this.logger.warn(message);
      throw new NotFoundException(message);
    }

    return user;
  }

  public async findById(id: string): Promise<UserDto> {
    this.logger.log(`findById ({id: ${id})`);

    return UserDto.fromModel(await this.findEntityById(id));
  }

  public async getMaxPageNumber(where: Prisma.UserWhereInput): Promise<number> {
    const pageSize = this.config.getOrThrow<number>('constants.pagination.default.table-contains');

    const count = await this.prisma.user.count({ where });

    return Math.floor(count / pageSize);
  }

  public async create(dto: UserCreateDto): Promise<User> {
    this.logger.log(`create ({dto: ${JSON.stringify(dto)}})`);

    await this.checkFieldUniquenessOnCreate(dto);

    const user = await this.prisma.user.create({ data: dto.toCreateInput(this.passwordCrypto) });

    this.logger.log(`Object created: [User] {id: ${user.id}}`);

    return user;
  }

  public async update(dto: UserUpdateDto, id: string): Promise<User> {
    this.logger.log(`update ({dto: ${JSON.stringify(dto)}, id: ${id})`);

    await this.checkFieldUniquenessOnUpdate(dto, id);

    const updateInput = dto.toUpdateInput(this.passwordCrypto);

    const user = await this.prisma.user.update({ data: updateInput, where: { id } });

    this.logger.log(`Object updated: [User] {id: ${user.id}}`);

    return user;
  }

  public async remove(id: string): Promise<void> {
    this.logger.log(`remove ({id: ${id})`);

    const user = await this.findEntityById(id);

    await this.prisma.user.delete({ where: { id: user.id } });
  }

  private async checkFieldUniquenessOnCreate(dto: UserCreateDto): Promise<void> {
    const { userByEmail, userByUsername } = await this.findUsersForUniquenessCheck(dto.email, dto.username);

    if (userByEmail) {
      this.processBadRequest(LOCALE.backend['userWithEmailExists'](dto.email));
    }

    if (userByUsername) {
      this.processBadRequest(LOCALE.backend['userWithUsernameExists'](dto.username));
    }
  }

  private async checkFieldUniquenessOnUpdate(dto: UserUpdateDto, id: string): Promise<void> {
    const { userByEmail, userByUsername } = await this.findUsersForUniquenessCheck(dto.email, dto.username);

    if (userByEmail) {
      if (userByEmail.id !== id) {
        this.processBadRequest(LOCALE.backend['userWithEmailExists'](dto.email));
      }
    }

    if (userByUsername) {
      if (userByUsername.id !== id) {
        this.processBadRequest(LOCALE.backend['userWithUsernameExists'](dto.username));
      }
    }
  }

  private async findUsersForUniquenessCheck(email: string, username: string): Promise<{ userByEmail: User; userByUsername: User }> {
    return {
      userByEmail: await this.prisma.user.findFirst({ where: { email } }),
      userByUsername: await this.prisma.user.findFirst({ where: { username } })
    };
  }

  private processBadRequest(message: string): void {
    this.logger.warn(message);
    throw new BadRequestException(message);
  }
}
