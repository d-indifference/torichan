import { Injectable } from '@nestjs/common';
import { BoardService } from '@backend/services';
import { IndexPage } from '@frontend/pages';

@Injectable()
export class IndexService {
  constructor(private readonly boardService: BoardService) {}

  public async index(): Promise<IndexPage> {
    const boards = await this.boardService.findAll({ visible: true }, null, { slug: 'asc' });

    return { boards };
  }
}
