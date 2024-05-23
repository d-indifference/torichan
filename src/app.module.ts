import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from '@config/application.config';
import { PrismaService } from '@utils/services';
import { BackendModule } from '@backend/backend.module';
import { ApiModule } from '@api/api.module';
import { FrontendModule } from '@frontend/frontend.module';
import { AdminModule } from '@admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [applicationConfig]
    }),
    AdminModule,
    BackendModule,
    ApiModule,
    FrontendModule
  ],
  controllers: [],
  providers: [PrismaService]
})
export class AppModule {}
