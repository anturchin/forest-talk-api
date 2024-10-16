import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { RedisKeys } from '../common/interfaces';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async saveWithExpiry(
    key: RedisKeys | string,
    value: string,
    expiryInSeconds: number
  ): Promise<void> {
    await this.redisRepository.set(key, value, expiryInSeconds);
  }

  async get(key: RedisKeys | string): Promise<string | null> {
    return this.redisRepository.get(key);
  }

  async set(key: RedisKeys | string, value: string): Promise<void> {
    await this.redisRepository.set(key, value);
  }

  async delete(key: RedisKeys | string): Promise<void> {
    await this.redisRepository.delete(key);
  }
}
