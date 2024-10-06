import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async saveWithExpiry(key: string, value: string, expiryInSeconds: number): Promise<void> {
    await this.redisRepository.set(key, value, expiryInSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.redisRepository.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisRepository.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.redisRepository.delete(key);
  }
}
