import { Injectable } from '@nestjs/common';
import { FileSystemService, PaginationResolveService } from '@utils/services';
import { BoardService as BackendBoardService } from '@backend/services';
import { SessionPayloadDto } from '@admin/dto';
import { BoardListPage, EditPage, EditPageFormArgsMode } from '@admin/pages';
import { validateNotEmptyPage } from '@utils/misc';
import { BoardCreateDto, BoardDto, BoardUpdateDto } from '@backend/dto/board';
import { Response } from 'express';

@Injectable()
export class BoardService {
  constructor(
    private readonly paginationResolve: PaginationResolveService,
    private readonly boardService: BackendBoardService,
    private readonly fileSystem: FileSystemService
  ) {}

  public async findList(session: SessionPayloadDto, page = 0): Promise<BoardListPage> {
    const boards = await this.boardService.findAll({}, this.paginationResolve.resolveTableSelection(page), { slug: 'asc' });

    validateNotEmptyPage(boards, page);

    return {
      session,
      maxPage: await this.boardService.getMaxPageNumber({}),
      currentPage: page,
      boards
    };
  }

  public async findById(session: SessionPayloadDto, id: string): Promise<EditPage<BoardDto>> {
    const board = await this.boardService.findById(id);

    return {
      session,
      args: {
        formDescription: `Edit board: ${board.name}`,
        formHandler: `/admin/board/${board.id}`,
        formMode: EditPageFormArgsMode.UPDATE,
        formData: board
      }
    };
  }

  public async create(dto: BoardCreateDto, res: Response): Promise<void> {
    const board = await this.boardService.create(dto);

    await this.fileSystem.ensureDir(board.slug);

    res.redirect(`/admin/board/${board.id}`);
  }

  public async update(dto: BoardUpdateDto, id: string, res: Response): Promise<void> {
    const board = await this.boardService.findById(id);
    const updatedBoard = await this.boardService.update(id, dto);

    await this.fileSystem.renameDir(board.slug, updatedBoard.slug);

    res.redirect(`/admin/board/${updatedBoard.id}`);
  }

  public async remove(id: string, res: Response): Promise<void> {
    const board = await this.boardService.findById(id);

    await this.boardService.remove(id);

    await this.fileSystem.removePath(board.slug);

    res.redirect('/admin/board');
  }
}
