import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан', type: User })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto as Required<CreateUserDto>);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей', type: [User] })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь найден', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 400, description: 'Неверный ID пользователя (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({
    status: 400,
    description: 'Неверный ID пользователя или данные для обновления (Bad Request)',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 204, description: 'Пользователь успешно удален.' })
  @ApiResponse({ status: 404, description: 'Пользователь c указанным ID не найден' })
  @ApiResponse({ status: 400, description: 'Неверный ID пользователя (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.userService.remove(Number(id));
  }
}
