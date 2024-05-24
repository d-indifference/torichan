import { Injectable, Logger } from '@nestjs/common';
import { VolumeSettingsService } from '@utils/services';
import { IpFilterGuard } from '@utils/guards';

@Injectable()
export class IpListFilesService {
  private readonly logger = new Logger(IpListFilesService.name);

  private readonly whiteListDefault = ['^(([1-9]?\\d|[12]\\d\\d)\\.){3}([1-9]?\\d|[12]\\d\\d)$', '(^::1)'];

  private readonly blackListDefault = [];

  constructor(
    private readonly volumeSettingsService: VolumeSettingsService,
    private readonly ipFilterGuard: IpFilterGuard
  ) {}

  public async create(): Promise<void> {
    this.logger.log('create ({})');

    const whiteListString = this.whiteListDefault.join('\r\n');
    const blackListString = this.blackListDefault.join('\r\n');

    if (!(await this.volumeSettingsService.checkIfFileExists('ip-whitelist'))) {
      await this.volumeSettingsService.create('ip-whitelist');
      await this.volumeSettingsService.write('ip-whitelist', whiteListString);
    }

    if (!(await this.volumeSettingsService.checkIfFileExists('ip-blacklist'))) {
      await this.volumeSettingsService.create('ip-blacklist');
      await this.volumeSettingsService.write('ip-blacklist', blackListString);
    }
  }

  public async getIpWhiteList(): Promise<string[]> {
    this.logger.log('getIpWhiteList ({})');

    return (await this.volumeSettingsService.read('ip-whitelist')).split('\r\n');
  }

  public async getIpBlackList(): Promise<string[]> {
    this.logger.log('getIpBlackList ({})');

    return (await this.volumeSettingsService.read('ip-blacklist')).split('\r\n');
  }

  public async setIpWhiteList(whiteList: string[]): Promise<void> {
    const string = whiteList.join('\r\n');
    this.ipFilterGuard.setWhiteList(whiteList);
    await this.volumeSettingsService.write('ip-whitelist', string);
  }

  public async setIpBlackList(blackList: string[]): Promise<void> {
    const string = blackList.join('\r\n');
    this.ipFilterGuard.setBlackList(blackList);
    await this.volumeSettingsService.write('ip-blacklist', string);
  }
}
