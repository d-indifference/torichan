import { Injectable, Logger } from '@nestjs/common';
import { VolumeSettingsService } from '@utils/services';
import { IpFilterService } from '@admin/services/ip-filter.service';

@Injectable()
export class IpListFilesService {
  private readonly logger = new Logger(IpListFilesService.name);

  private readonly whiteListDefault = [];

  private readonly blackListDefault = [];

  constructor(
    private readonly volumeSettingsService: VolumeSettingsService,
    private readonly ipListService: IpFilterService
  ) {}

  public async create(): Promise<void> {
    this.logger.log('create ({})');

    if (!(await this.volumeSettingsService.checkIfFileExists('ip-whitelist'))) {
      const whiteListString = this.whiteListDefault.join('\r\n');

      await this.volumeSettingsService.create('ip-whitelist');
      await this.volumeSettingsService.write('ip-whitelist', whiteListString);
    }

    if (!(await this.volumeSettingsService.checkIfFileExists('ip-blacklist'))) {
      const blackListString = this.blackListDefault.join('\r\n');

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
    this.ipListService.setWhiteList(whiteList);
    const string = whiteList.join('\r\n');
    await this.volumeSettingsService.write('ip-whitelist', string);
  }

  public async setIpBlackList(blackList: string[]): Promise<void> {
    this.ipListService.setBlackList(blackList);
    const string = blackList.join('\r\n');
    await this.volumeSettingsService.write('ip-blacklist', string);
  }
}
