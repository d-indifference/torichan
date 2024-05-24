import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileSystemService, PasswordCryptoService, PrismaService, VolumeSettingsService } from '@utils/services';
import { AttachedFileService, BanService, BoardService, CommentService, SpamService, UserService } from '@backend/services';

@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    FileSystemService,
    PasswordCryptoService,
    BoardService,
    CommentService,
    AttachedFileService,
    UserService,
    BanService,
    VolumeSettingsService,
    SpamService
  ],
  controllers: [],
  exports: [BoardService, CommentService, UserService, AttachedFileService, BanService]
})
export class BackendModule {}
