import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis.client';
import { RedisService } from './redis.service';
import { RedisRepository } from './redis.repository';
import { REDIS_CLIENT } from '../common/constants';

@Module({
  providers: [redisClientFactory, RedisService, RedisRepository],
  exports: [REDIS_CLIENT, RedisService, RedisRepository],
})
export class RedisModule {}
