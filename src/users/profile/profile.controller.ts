import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('users/:id/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Param('id') userId: string) {
    console.log(userId);
  }

  @Patch()
  async updateProfile(@Param('id') userId: string) {
    console.log(userId);
  }
}
