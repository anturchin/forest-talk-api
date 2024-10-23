import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserGalleryDto } from './dto/create-gallery.dto';
import { UserGallery } from '../entities/gallery.entity';

@Injectable()
export class UserGalleryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService
  ) {}

  async getAll(userId: number): Promise<UserGallery[]> {
    console.log(userId);
    return [];
  }

  async create(createUserGalleryDto: CreateUserGalleryDto): Promise<UserGallery> {
    console.log(createUserGalleryDto);
    throw new InternalServerErrorException();
  }

  async delete({ imageId, userId }: { userId: number; imageId: number }): Promise<void> {
    console.log(userId, imageId);
  }
}
