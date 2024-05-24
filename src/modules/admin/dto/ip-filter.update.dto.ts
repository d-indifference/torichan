import { IsNotEmpty, IsString } from 'class-validator';

export class IpFilterUpdateDto {
  @IsString()
  @IsNotEmpty()
  ipList: string;

  public mapListToArray(): string[] {
    return this.ipList
      .trim()
      .split('\r\n')
      .filter(val => val !== '');
  }
}
