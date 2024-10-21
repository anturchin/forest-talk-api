import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from '../entities/profile.entity';
import { ErrorMessages } from '../../common/constants';
import { serializeObjBigInt } from '../../common/utils/serialize.utils';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProfileDto: CreateProfileDto): Promise<void> {
    await this.prismaService.profile.create({
      data: { ...createProfileDto },
    });
  }

  async delete(userId: number): Promise<void> {
    const profile = await this.findById(userId);
    if (profile) {
      await this.prismaService.profile.delete({
        where: { user_id: userId },
      });
    }
  }

  async update(userId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findById(userId);
    if (!profile) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(userId));
    const newProfile = { ...profile, ...updateProfileDto };

    try {
      const updatedProfile = await this.prismaService.profile.update({
        where: { user_id: userId },
        data: newProfile,
      });
      return serializeObjBigInt(updatedProfile, ErrorMessages.PROFILE_SERIALIZATION_ERROR);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findById(userId: number): Promise<Profile> {
    const profile = await this.prismaService.profile.findUnique({ where: { user_id: userId } });
    return serializeObjBigInt(profile, ErrorMessages.PROFILE_SERIALIZATION_ERROR);
  }
}
