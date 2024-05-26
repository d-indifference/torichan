import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BackendModule } from '@backend/backend.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';
import { FileSystemService, PaginationResolveService, PasswordCryptoService, PrismaService, VolumeSettingsService } from '@utils/services';
import {
  AuthController,
  BanController,
  BoardController,
  CommentController,
  FileController,
  HomePageController,
  IpFilterController,
  SpamController,
  SqlConsoleController,
  UserController
} from '@admin/controllers';
import {
  HomeService,
  UserService,
  BoardService,
  CommentService,
  BanService,
  FileQueriesService,
  FileService,
  SqlConsoleService,
  IpListFilesService,
  IpFilterService
} from '@admin/services';

@Module({
  imports: [
    ConfigModule,
    BackendModule,
    NestjsFormDataModule.configAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: nestjsFormDataConfig
    })
  ],
  providers: [
    PrismaService,
    PaginationResolveService,
    FileSystemService,
    PasswordCryptoService,
    UserService,
    BoardService,
    HomeService,
    CommentService,
    BanService,
    FileQueriesService,
    FileService,
    SqlConsoleService,
    VolumeSettingsService,
    IpListFilesService,
    IpFilterService
  ],
  controllers: [
    HomePageController,
    AuthController,
    UserController,
    BoardController,
    BanController,
    CommentController,
    FileController,
    SqlConsoleController,
    SpamController,
    IpFilterController
  ],
  exports: []
})
export class AdminModule {}
