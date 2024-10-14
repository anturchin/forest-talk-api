import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisService } from '../redis/redis.service';
import { RedisRepository } from '../redis/redis.repository';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [RedisModule, PrismaModule],
  providers: [UsersService, RedisRepository, RedisService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
