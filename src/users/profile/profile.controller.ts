import { Body, Controller, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ErrorMessages } from '../../common/constants';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Profile } from '../entities/profile.entity';

@ApiTags('profile')
@Controller('users')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  @ApiOperation({ summary: 'Получить профиль пользователя по ID' })
  @ApiHeader({ name: 'Bearer', required: true, description: 'Access token' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя', type: Profile })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async getProfile(@Param('id', ParseIntPipe) userId: number): Promise<Profile> {
    const profile = await this.profileService.findById(userId);
    if (!profile) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(userId));
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/profile')
  @ApiOperation({ summary: 'Обновить профиль пользователя по ID' })
  @ApiHeader({ name: 'Bearer', required: true, description: 'Access token' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя', type: Profile })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async updateProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateProfileDto: UpdateProfileDto
  ): Promise<Profile> {
    return this.profileService.update(userId, updateProfileDto);
  }
}
