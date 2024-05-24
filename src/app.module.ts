import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import applicationConfig from '@config/application.config';
import { PrismaService, VolumeSettingsService } from '@utils/services';
import { BackendModule } from '@backend/backend.module';
import { ApiModule } from '@api/api.module';
import { FrontendModule } from '@frontend/frontend.module';
import { AdminModule } from '@admin/admin.module';
import { IpFilterGuard } from '@utils/guards';
import { IpFilterController } from './ip-filter.controller';
import { IpListFilesService } from './ip-list-files.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { nestjsFormDataConfig } from '@config/nestjs-form-data.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [applicationConfig]
    }),
    AdminModule,
    BackendModule,
    ApiModule,
    FrontendModule,
    NestjsFormDataModule.configAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: nestjsFormDataConfig
    })
  ],
  controllers: [IpFilterController],
  providers: [PrismaService, IpListFilesService, VolumeSettingsService, IpFilterGuard]
})
export class AppModule {}
