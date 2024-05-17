import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileSystemService, PrismaService } from '@utils/services';
import { AttachedFileService, BoardService, CommentService } from '@backend/services';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, FileSystemService, BoardService, CommentService, AttachedFileService],
  controllers: [],
  exports: [BoardService, CommentService]
})
export class BackendModule {}
