import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { UserGalleryController } from './gallery.controller';
import { RedisModule } from '../../redis/redis.module';
import { UserGalleryService } from './gallery.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [UserGalleryService],
  controllers: [UserGalleryController],
})
export class UserGalleryModule {}
