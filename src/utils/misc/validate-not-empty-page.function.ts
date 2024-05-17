import { NotFoundException } from '@nestjs/common';

export const validateNotEmptyPage = (elements: unknown[], page: number): void => {
  if (page > 0 && elements.length === 0) {
    throw new NotFoundException('Page was not found');
  }
};
