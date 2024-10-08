import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { RedisService } from '../redis/redis.service';
import { RedisRepository } from '../redis/redis.repository';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  providers: [UsersService, RedisRepository, RedisService],
  controllers: [UsersController],
})
export class UsersModule {}
