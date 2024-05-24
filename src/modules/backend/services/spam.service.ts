import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { VolumeSettingsService } from '@utils/services';

@Injectable()
export class SpamService {
  private readonly logger = new Logger(SpamService.name);

  constructor(private readonly volumeSettingsService: VolumeSettingsService) {}

  public async checkSpam(str: string): Promise<void> {
    const spamList = await this.getSpamList();

    spamList.forEach(position => {
      if (str.search(`${position}`) !== -1) {
        this.logger.log(`Spam detected: ${str}`);
        throw new ForbiddenException('Spam has been detected in your inputs.');
      }
    });
  }

  private async getSpamList(): Promise<string[]> {
    const spamStringRead = await this.volumeSettingsService.read('spam-list');
    return spamStringRead.split('\r\n');
  }
}
