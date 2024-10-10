import { Prisma } from '@prisma/client';

export enum RedisKeys {
  USER_KEY_PREFIX = 'user:',
  USER_LIST = 'user:list',
}

export type CreateUser = Prisma.UserCreateInput;
