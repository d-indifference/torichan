import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonPagesController } from '@frontend/controllers';

@Module({
  imports: [ConfigModule],
  providers: [],
  controllers: [CommonPagesController],
  exports: []
})
export class FrontendModule {}
