import { Injectable } from '@nestjs/common';
import { FileQueriesService } from '@admin/services/file-queries.service';
import { FileDisplayDto, FileRemoveDto, SessionPayloadDto } from '@admin/dto';
import { FileListPage } from '@admin/pages';
import { BoardService } from '@backend/services';
import { PrismaTakeSkipDto } from '@utils/misc';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    private readonly fileQueries: FileQueriesService,
    private readonly boardService: BoardService
  ) {}

  public async findAll(session: SessionPayloadDto, slug: string, page: number): Promise<FileListPage> {
    const allBoards = await this.boardService.findAll({}, new PrismaTakeSkipDto(), { slug: 'asc' });

    if (!slug) {
      return { maxPage: 0, currentPage: page, session, files: [], currentBoard: null, allBoards };
    }

    const board = await this.boardService.findBySlug(slug);
    const { files, currentPage, maxPage } = await this.fileQueries.findAll(slug, page);

    return { maxPage, currentPage, session, files: files.map(file => FileDisplayDto.fromFileDto(file)), currentBoard: board ?? null, allBoards };
  }

  public async remove(dto: FileRemoveDto, res: Response): Promise<void> {
    await this.fileQueries.remove(dto.srcPath, dto.thumbnailPath);

    res.redirect(dto.redirectTo);
  }
}
