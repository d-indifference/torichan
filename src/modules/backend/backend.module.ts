import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@utils/services';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  controllers: [],
  exports: []
})
export class BackendModule {}
