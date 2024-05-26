import { IsString } from 'class-validator';

export class IpFilterUpdateDto {
  @IsString()
  ipList: string;
}
