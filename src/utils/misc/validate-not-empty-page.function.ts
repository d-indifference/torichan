import { NotFoundException } from '@nestjs/common';
import { LOCALE } from '@utils/locale';

export const validateNotEmptyPage = (elements: unknown[], page: number): void => {
  if (page > 0 && elements.length === 0) {
    throw new NotFoundException(LOCALE.utils['pageWasNotFound']);
  }
};
