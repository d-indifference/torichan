import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@utils/services';
import { BoardCreateDto, BoardDto, BoardUpdateDto } from '@backend/dto/board';
import { Board, Prisma } from '@prisma/client';
import { PrismaTakeSkipDto } from '@utils/misc';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async findAll(
    where: Prisma.BoardWhereInput,
    selection?: PrismaTakeSkipDto,
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[]
  ): Promise<BoardDto[]> {
    this.logger.log(`findAll ({where: ${JSON.stringify(where)}, selection: ${selection.toString()}, orderBy: ${JSON.stringify(orderBy)}})`);

    const boards = await this.prisma.board.findMany({ where, ...selection, orderBy });

    return boards.map(board => BoardDto.fromModel(board));
  }

  public async findEntityById(id: string): Promise<Board> {
    this.logger.log(`findEntityById ({id: ${id}})`);

    const board = await this.prisma.board.findFirst({ where: { id } });

    this.processNotFound(board, `Board with id: ${id} was not found`);

    return board;
  }

  public async findById(id: string): Promise<BoardDto> {
    this.logger.log(`findById ({id: ${id}})`);

    const board = await this.findEntityById(id);

    return BoardDto.fromModel(board);
  }

  public async findBySlug(slug: string): Promise<BoardDto> {
    this.logger.log(`findBySlug ({slug: ${slug}})`);

    const board = await this.prisma.board.findFirst({ where: { slug } });

    this.processNotFound(board, `Board with slug: ${slug} was not found`);

    return BoardDto.fromModel(board);
  }

  public async incrementPostCount(id: string): Promise<void> {
    this.logger.log(`incrementPostCount ({id: ${id}})`);

    const board = await this.findEntityById(id);

    await this.prisma.board.update({
      where: { id: board.id },
      data: { postCount: board.postCount + 1 }
    });
  }

  public async update(id: string, dto: BoardUpdateDto): Promise<Board> {
    this.logger.log(`update ({id: ${id}, dto: ${dto.toString()}})`);

    await this.checkSlugUniquenessOnUpdate(id, dto);

    const board = await this.findEntityById(id);

    return (await this.prisma.board.update({ where: { id: board.id }, data: dto.toUpdateInput() })) as Board;
  }

  public async create(dto: BoardCreateDto): Promise<Board> {
    this.logger.log(`create ({dto: ${dto.toString()}})`);

    await this.checkSlugUniquenessOnCreate(dto);

    return (await this.prisma.board.create({ data: dto.toCreateInput() })) as Board;
  }

  public async remove(id: string): Promise<void> {
    this.logger.log(`remove ({id: ${id}})`);

    const board = await this.findEntityById(id);

    await this.prisma.board.delete({ where: { id: board.id } });
  }

  private processNotFound(board: Board, message: string): void {
    if (!board) {
      this.logger.warn(message);
      throw new NotFoundException(message);
    }
  }

  private async checkSlugUniquenessOnUpdate(id: string, dto: BoardUpdateDto): Promise<void> {
    const board = await this.prisma.board.findFirst({ where: { slug: dto.slug } });

    if (board) {
      if (board.id !== id) {
        const message: string = `Board with slug: ${dto.slug} already exists`;

        this.logger.log(message);
        throw new BadRequestException(message);
      }
    }
  }

  private async checkSlugUniquenessOnCreate(dto: BoardCreateDto): Promise<void> {
    const board = await this.prisma.board.findFirst({ where: { slug: dto.slug } });

    if (board) {
      const message: string = `Board with slug: ${dto.slug} already exists`;

      this.logger.log(message);
      throw new BadRequestException(message);
    }
  }
}
