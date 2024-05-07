import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaTakeSkipDto } from '@utils/misc';

@Injectable()
export class PaginationResolveService {
  constructor(private readonly config: ConfigService) {}

  public resolveThreadSelection(page = 0): PrismaTakeSkipDto {
    const pageSize = this.config.getOrThrow<number>('constants.pagination.default.threads');
    const skipCount = page * pageSize;

    return new PrismaTakeSkipDto(pageSize, skipCount);
  }
}
