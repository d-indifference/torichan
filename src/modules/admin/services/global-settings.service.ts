import { Injectable, Logger } from '@nestjs/common';
import { VolumeSettingsService } from '@utils/services';
import { GlobalSettingsDto } from '@admin/dto';
import {
  DEFAULT_FAQ_PAGE,
  DEFAULT_MENU_FRAME,
  DEFAULT_RULES_PAGE,
  DEFAULT_SITE_NAME,
  DEFAULT_SITE_NAVBAR,
  DEFAULT_SITE_SLOGAN,
  DEFAULT_START_PAGE
} from '@admin/misc';

@Injectable()
export class GlobalSettingsService {
  private readonly logger = new Logger(GlobalSettingsService.name);

  private readonly volume: string = 'global-settings';

  constructor(private readonly volumeSettingsService: VolumeSettingsService) {}

  public async create(): Promise<void> {
    this.logger.log('create ({})');

    if (!(await this.volumeSettingsService.checkIfFileExists(this.volume))) {
      await this.volumeSettingsService.create(this.volume);

      const settingsDtoDefault = new GlobalSettingsDto(
        DEFAULT_SITE_NAME,
        DEFAULT_SITE_SLOGAN,
        DEFAULT_SITE_NAVBAR,
        DEFAULT_MENU_FRAME,
        DEFAULT_START_PAGE,
        DEFAULT_FAQ_PAGE,
        DEFAULT_RULES_PAGE
      );

      await this.volumeSettingsService.write(this.volume, JSON.stringify(settingsDtoDefault));

      global[this.volume] = settingsDtoDefault;
    } else {
      global[this.volume] = await this.get();
    }
  }

  public async get(): Promise<GlobalSettingsDto> {
    this.logger.log('get ({})');

    return JSON.parse(await this.volumeSettingsService.read(this.volume)) as GlobalSettingsDto;
  }

  public async update(dto: GlobalSettingsDto): Promise<void> {
    this.logger.log(`update ({ dto: ${JSON.stringify(dto)} })`);

    global[this.volume] = dto;

    await this.volumeSettingsService.write(this.volume, JSON.stringify(dto));
  }
}
