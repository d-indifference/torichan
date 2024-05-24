import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { VolumeSettingsService } from '@utils/services';
import { lineBrokenStringToArray } from '@utils/misc';

@Injectable()
export class IpFilterGuard implements CanActivate {
  private whiteList: string[];

  private blackList: string[];

  constructor(private readonly volumeSettingsService: VolumeSettingsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.whiteList = lineBrokenStringToArray(await this.volumeSettingsService.read('ip-whitelist'));
    this.blackList = lineBrokenStringToArray(await this.volumeSettingsService.read('ip-blacklist'));

    const req: Request = context.switchToHttp().getRequest();

    const inWhiteList = this.checkWhiteList(req.ip);

    if (inWhiteList) {
      return true;
    }

    const inBlackList = this.checkBlackList(req.ip);

    if (inBlackList) {
      const message = `IP in blacklist: ${req.ip}`;
      Logger.warn(message, IpFilterGuard.name);
      throw new ForbiddenException(message);
    }

    return true;
  }

  public setWhiteList(whiteList: string[]): void {
    this.whiteList = whiteList;
  }

  public setBlackList(blackList: string[]): void {
    this.blackList = blackList;
  }

  private checkWhiteList(ip: string): boolean {
    for (const position of this.whiteList) {
      if (ip.search(`${position}`) !== -1) {
        return true;
      }
    }

    return false;
  }

  private checkBlackList(ip: string): boolean {
    for (const position of this.blackList) {
      if (ip.search(`${position}`) !== -1) {
        return true;
      }
    }

    return false;
  }
}
