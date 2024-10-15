import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis.client';
import { RedisService } from './redis.service';
import { RedisRepository } from './redis.repository';

@Module({
  providers: [redisClientFactory, RedisService, RedisRepository],
  exports: ['RedisClient', RedisService, RedisRepository],
})
export class RedisModule {}
