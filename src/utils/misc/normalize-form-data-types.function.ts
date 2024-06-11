import { BadRequestException } from '@nestjs/common';

export const normalizeBoolean = (source: 'on' | undefined): boolean => source === 'on';

export const normalizeInteger = (source: string, options?: { min: number; max: number }): number => {
  const int = parseInt(source);

  if (isNaN(int)) {
    throw new BadRequestException(`Number: ${source} must be an integer`);
  }

  const wholeInt = Math.floor(int);

  if (options) {
    if (wholeInt < options.min) {
      return options.min;
    }

    if (wholeInt > options.max) {
      return options.max;
    }
  }

  return wholeInt;
};
