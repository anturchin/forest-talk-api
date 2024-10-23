import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { UserGalleryController } from './gallery.controller';
import { RedisModule } from '../../redis/redis.module';
import { UserGalleryService } from './gallery.service';
import { UsersModule } from '../users.module';

@Module({
  imports: [PrismaModule, RedisModule, forwardRef(() => UsersModule)],
  providers: [UserGalleryService],
  controllers: [UserGalleryController],
})
export class UserGalleryModule {}
