import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis.client';

@Module({
  providers: [redisClientFactory],
  exports: ['RedisClient'],
})
export class RedisModule {}
