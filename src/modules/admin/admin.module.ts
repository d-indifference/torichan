import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BackendModule } from '@backend/backend.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';
import { FileSystemService, PaginationResolveService, PasswordCryptoService, PrismaService } from '@utils/services';
import { AuthController, BanController, BoardController, CommentController, HomePageController, UserController } from '@admin/controllers';
import { HomeService, UserService, BoardService, CommentService, BanService } from '@admin/services';

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
    BanService
  ],
  controllers: [HomePageController, AuthController, UserController, BoardController, BanController, CommentController],
  exports: []
})
export class AdminModule {}
