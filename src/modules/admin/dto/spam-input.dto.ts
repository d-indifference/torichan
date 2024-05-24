import { IsNotEmpty, IsString } from 'class-validator';

export class SpamInputDto {
  @IsString()
  @IsNotEmpty()
  spam: string;
}
