import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [],
  controllers: [],
  exports: []
})
export class ApiModule {}
