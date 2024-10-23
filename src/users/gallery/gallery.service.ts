import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateUserGalleryDto } from './dto/create-gallery.dto';
import { UserGallery } from '../entities/gallery.entity';
import { DEFAULT_CACHE_TTL, ErrorMessages } from '../../common/constants';
import { serializeObjBigInt } from '../../common/utils/serialize.utils';
import { UsersService } from '../users.service';
import { RedisKeys } from '../../common/interfaces';

@Injectable()
export class UserGalleryService {
  private readonly logger = new Logger(UserGalleryService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly redisService: RedisService
  ) {}

  async findAll(userId: number): Promise<UserGallery[]> {
    await this.userService.findOne(userId);
    const redisKey = `${userId}:${RedisKeys.GALLERY_LIST}`;

    try {
      const cachedGallery = await this.redisService.get(redisKey);
      if (cachedGallery) return JSON.parse(cachedGallery) as UserGallery[];
    } catch (e) {
      this.logger.warn(`Cache error: ${e.message}`);
    }

    let galleryList: UserGallery[] = [];

    try {
      galleryList = (await this.prismaService.userGallery.findMany({
        where: { user_id: userId },
      })) as UserGallery[];
    } catch {
      throw new ConflictException(ErrorMessages.GALLERY_LIST_ERROR);
    }

    const serializedGallery = galleryList.map((gallery) =>
      serializeObjBigInt(gallery, ErrorMessages.GALLERY_SERIALIZATION_ERROR)
    );

    try {
      await this.redisService.saveWithExpiry(
        redisKey,
        JSON.stringify(serializedGallery),
        DEFAULT_CACHE_TTL
      );
    } catch (e) {
      this.logger.warn(`Cache error: ${e.message}`);
    }

    return serializedGallery;
  }

  async create(createUserGalleryDto: CreateUserGalleryDto): Promise<UserGallery> {
    await this.userService.findOne(createUserGalleryDto.user_id);
    try {
      const saveMedia = await this.prismaService.userGallery.create({
        data: createUserGalleryDto as UserGallery,
      });

      const redisKey = `${createUserGalleryDto.user_id}:${RedisKeys.GALLERY_LIST}`;

      try {
        await this.redisService.delete(redisKey);
      } catch (e) {
        this.logger.warn(`Cache error: ${e.message}`);
      }

      return serializeObjBigInt(saveMedia, ErrorMessages.GALLERY_SERIALIZATION_ERROR);
    } catch {
      throw new ConflictException(ErrorMessages.GALLERY_CREATION_ERROR);
    }
  }

  async findOne(imageId: number): Promise<UserGallery> {
    try {
      const media = await this.prismaService.userGallery.findUnique({ where: { img_id: imageId } });
      if (!media) throw new NotFoundException(ErrorMessages.GALLERY_NOT_FOUND(imageId));
      return media;
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  async delete({ id, imageId }: { id: number; imageId: number }): Promise<void> {
    await this.userService.findOne(id);
    try {
      await this.findOne(imageId);
      await this.prismaService.userGallery.delete({ where: { img_id: imageId } });

      const redisKey = `${id}:${RedisKeys.GALLERY_LIST}`;

      try {
        await this.redisService.delete(redisKey);
      } catch (e) {
        this.logger.warn(`Cache error: ${e.message}`);
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException(e.message);
      }
      throw new InternalServerErrorException(ErrorMessages.SERVER_ERROR);
    }
  }
}
