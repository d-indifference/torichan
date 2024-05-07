import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@utils/services';
import { BoardService } from '@backend/services';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, BoardService],
  controllers: [],
  exports: [BoardService]
})
export class BackendModule {}
