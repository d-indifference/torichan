import { BadRequestException, PipeTransform } from '@nestjs/common';

const parsePositive = (val: number): number => {
  if (val < 0) {
    throw new BadRequestException('Value must be greater than 0');
  } else {
    return Math.abs(val);
  }
};

export class ParsePositiveNumberPipe implements PipeTransform {
  transform(value: number): number {
    return parsePositive(value);
  }
}

export class ParseOptionalPositiveNumberPipe implements PipeTransform {
  transform(value: number): number {
    if (value) {
      return parsePositive(value);
    }
    return 0;
  }
}
