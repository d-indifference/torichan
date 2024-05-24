import { IsNotEmpty, IsString } from 'class-validator';

export class SqlQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
