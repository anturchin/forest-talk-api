import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CreateUserGalleryDto } from './dto/create-gallery.dto';
import { UserGallery } from '../entities/gallery.entity';
import { ErrorMessages } from '../../common/constants';
import { serializeObjBigInt } from '../../common/utils/serialize.utils';

@Injectable()
export class UserGalleryService {
  private readonly logger = new Logger(UserGalleryService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService
  ) {}

  async findAll(userId: number): Promise<UserGallery[]> {
    let galleryList: UserGallery[] = [];

    try {
      galleryList = (await this.prismaService.userGallery.findMany({
        where: { user_id: userId },
      })) as UserGallery[];
    } catch {
      throw new ConflictException(ErrorMessages.GALLERY_LIST_ERROR);
    }

    return galleryList.map((gallery) =>
      serializeObjBigInt(gallery, ErrorMessages.GALLERY_SERIALIZATION_ERROR)
    );
  }

  async create(createUserGalleryDto: CreateUserGalleryDto): Promise<UserGallery> {
    try {
      const saveMedia = await this.prismaService.userGallery.create({
        data: createUserGalleryDto as UserGallery,
      });
      return serializeObjBigInt(saveMedia, ErrorMessages.GALLERY_SERIALIZATION_ERROR);
    } catch {
      throw new ConflictException(ErrorMessages.GALLERY_CREATION_ERROR);
    }
  }

  async findOne(imageId: number): Promise<UserGallery> {
    try {
      return this.prismaService.userGallery.findUnique({ where: { img_id: imageId } });
    } catch {
      throw new ConflictException(ErrorMessages.GALLERY_NOT_FOUND(imageId));
    }
  }

  async delete(imageId: number): Promise<void> {
    try {
      const media = await this.findOne(imageId);
      await this.prismaService.userGallery.delete({ where: { img_id: media.img_id } });
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new ConflictException(e.message);
      }
      throw new InternalServerErrorException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
}
