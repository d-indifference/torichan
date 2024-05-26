import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { IpFilterService } from '@admin/services';

@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(private readonly ipFilterService: IpFilterService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    const inWhiteList = this.checkInList(req.ip, this.ipFilterService.getWhiteList());

    if (inWhiteList) {
      return true;
    }

    const inBlackList = this.checkInList(req.ip, this.ipFilterService.getBlackList());

    if (inBlackList) {
      const message = `IP in blacklist: ${req.ip}`;
      Logger.warn(message, IpFilterGuard.name);
      throw new ForbiddenException(message);
    }

    return true;
  }

  private checkInList(ip: string, list: string[]): boolean {
    for (const position of list) {
      if (list.length > 1 || !(list.length === 1 && list[0] === '')) {
        if (ip.search(`${position}`) !== -1) {
          return true;
        }
      }
    }

    return false;
  }
}
