import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client';

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
  async create(@Body() createUserDto: CreateUserDto): Promise<PrismaUser> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей', type: [User] })
  async findAll(): Promise<PrismaUser[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь найден', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id') id: string): Promise<PrismaUser> {
    return await this.userService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<PrismaUser> {
    return await this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 204, description: 'Пользователь успешно удален.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.userService.remove(Number(id));
  }
}
