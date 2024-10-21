import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { RedisKeys } from '../common/interfaces';
import { ErrorMessages } from '../common/constants';

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
    try {
      const val = await this.redisRepository.get(key);
      return val;
    } catch {
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async set(key: RedisKeys | string, value: string): Promise<void> {
    try {
      await this.redisRepository.set(key, value);
    } catch {
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(key: RedisKeys | string): Promise<void> {
    try {
      await this.redisRepository.delete(key);
    } catch {
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
}
