import { BadRequestException } from '@nestjs/common';

const serializeBigInt = (key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

export const serializeObjBigInt = <T>(obj: T, msg: string): T => {
  try {
    return JSON.parse(JSON.stringify(obj, serializeBigInt)) as T;
  } catch {
    throw new BadRequestException(msg);
  }
};
