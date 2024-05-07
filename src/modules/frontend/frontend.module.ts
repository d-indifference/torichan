import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonPagesController } from '@frontend/controllers';
import { BackendModule } from '@backend/backend.module';
import { BoardService } from '@frontend/services';
import { PaginationResolveService } from '@utils/services';

@Module({
  imports: [ConfigModule, BackendModule],
  providers: [BoardService, PaginationResolveService],
  controllers: [CommonPagesController],
  exports: []
})
export class FrontendModule {}
