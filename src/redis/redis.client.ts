import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e.message}`);
    });

    return redisInstance;
  },
  inject: [],
};
