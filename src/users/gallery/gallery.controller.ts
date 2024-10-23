import { UserGalleryService } from './gallery.service';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { UserGallery } from '../entities/gallery.entity';
import { CreateUserGalleryDto } from './dto/create-gallery.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('gallery')
@Controller('users')
export class UserGalleryController {
  constructor(private readonly userGalleryService: UserGalleryService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id/gallery')
  @ApiResponse({ status: 200, description: 'Медиа пользователя', type: [UserGallery] })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async getAllGallery(@Param('id', ParseIntPipe) id: number): Promise<UserGallery[]> {
    return this.userGalleryService.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/gallery')
  @ApiResponse({
    status: 200,
    description: 'Картинка успешно добавлена в галерею',
    type: UserGallery,
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async createGallery(@Body() createUserGalleryDto: CreateUserGalleryDto): Promise<UserGallery> {
    return this.userGalleryService.create(createUserGalleryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/gallery/:imageId')
  @ApiResponse({ status: 200, description: 'Медиа успешно удалено из галерии' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async deleteGallery(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number
  ): Promise<void> {
    return this.userGalleryService.delete({ id, imageId });
  }
}
