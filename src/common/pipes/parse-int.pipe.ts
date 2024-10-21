import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value);
    if (isNaN(val)) {
      throw new BadRequestException(`ID не является числом`);
    }
    return val;
  }
}
