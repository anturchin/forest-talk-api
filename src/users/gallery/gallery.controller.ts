import { UserGalleryService } from './gallery.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe';
import { UserGallery } from '../entities/gallery.entity';
import { CreateUserGalleryDto } from './dto/create-gallery.dto';

@ApiTags('gallery')
@Controller('users')
export class UserGalleryController {
  constructor(private readonly userGalleryService: UserGalleryService) {}

  @Get(':id/gallery')
  @ApiResponse({ status: 200, description: 'Галерея пользователя', type: [UserGallery] })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async getAllGallery(@Param('id', ParseIntPipe) id: number): Promise<UserGallery[]> {
    return this.userGalleryService.getAll(id);
  }

  @Post(':id/gallery')
  @ApiResponse({
    status: 200,
    description: 'Картинка успешно добавлена в галерею',
    type: UserGallery,
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async createGallery(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserGalleryDto: CreateUserGalleryDto
  ): Promise<UserGallery> {
    return this.userGalleryService.create(createUserGalleryDto);
  }

  @Delete(':id/gallery/:imageId')
  @ApiResponse({ status: 200, description: 'Картинка успешно удалена из галерии' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async deleteGallery(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number
  ): Promise<void> {
    return this.userGalleryService.delete({ userId: id, imageId });
  }
}
