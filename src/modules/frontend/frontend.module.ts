import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonPagesController, PostHandlersController } from '@frontend/controllers';
import { BackendModule } from '@backend/backend.module';
import { BoardService, CommentService, IndexService, ThreadService } from '@frontend/services';
import { CaptchaService, PaginationResolveService } from '@utils/services';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';

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
  providers: [IndexService, BoardService, PaginationResolveService, CommentService, ThreadService, CaptchaService],
  controllers: [CommonPagesController, PostHandlersController],
  exports: []
})
export class FrontendModule {}
