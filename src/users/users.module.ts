import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { UserGalleryModule } from './gallery/gallery.module';

@Module({
  imports: [RedisModule, PrismaModule, ProfileModule, UserGalleryModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
