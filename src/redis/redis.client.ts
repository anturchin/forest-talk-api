import { FactoryProvider, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const logger = new Logger('RedisClient');

    const redisInstance = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    redisInstance.on('error', (e) => {
      logger.error(`Ошибка подключения к Redis: ${e.message}`);
    });
    redisInstance.on('connect', () => {
      logger.log(`Успешное подключение к Redis`);
    });

    return redisInstance;
  },
  inject: [],
};
