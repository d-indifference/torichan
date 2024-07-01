import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CommentRemoveDto, CommentRemoveNotNormalizedDto } from '@frontend/dto';
import { LOCALE } from '@utils/locale';

export class NormalizeRemoveCommentDtoPipe implements PipeTransform {
  transform(value: CommentRemoveNotNormalizedDto): CommentRemoveDto {
    const result = new CommentRemoveDto();

    if (this.checkIfFieldIsArray(value.delete)) {
      result.delete = (value.delete as string[]).map(val => this.parseNumber(val));
    } else {
      result.delete = [this.parseNumber(value.delete as string)];
    }

    result.fileOnly = value.fileOnly === 'on';

    result.password = value.password;

    return result;
  }

  private checkIfFieldIsArray(value: string[] | string): boolean {
    return Array.isArray(value);
  }

  private parseNumber(val: string): number {
    const result = Number(val);

    if (isNaN(result)) {
      throw new BadRequestException(LOCALE.frontend['valueMustBeNumber'](val));
    } else {
      return result;
    }
  }
}
