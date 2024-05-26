import { Injectable } from '@nestjs/common';

@Injectable()
export class IpFilterService {
  constructor() {}

  public getWhiteList(): string[] {
    return global['whitelist'].filter((item: string) => item !== '');
  }

  public setWhiteList(list: string[]): void {
    global['whitelist'] = list;
  }

  public getBlackList(): string[] {
    return global['blacklist'].filter((item: string) => item !== '');
  }

  public setBlackList(list: string[]): void {
    global['blacklist'] = list;
  }
}
