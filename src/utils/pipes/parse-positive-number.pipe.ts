import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParsePositiveNumberPipe implements PipeTransform {
  transform(value: number): number {
    if (value < 0) {
      throw new BadRequestException('Value must be greater than 0');
    } else {
      return Math.abs(value);
    }
  }
}
