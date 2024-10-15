import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from '../entities/profile.entity';

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

  async findById(userId: number): Promise<Profile> {
    return this.prismaService.profile.findUnique({ where: { user_id: userId } });
  }
}
