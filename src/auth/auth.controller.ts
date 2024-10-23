import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CheckEmailDto, RegisterDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RefreshResponseDto, RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from '../common/guards/refresh-auth.guard';
import { UsersService } from '../users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Get('check-email')
  @ApiOperation({ summary: 'Проверить, существует ли email в системе' })
  @ApiQuery({ name: 'email', required: true, description: 'Email для проверки' })
  @ApiResponse({ status: 200, description: 'Email найден / не найден' })
  @ApiResponse({ status: 400, description: 'Некорректный email' })
  async checkEmail(@Query() { email }: CheckEmailDto): Promise<{ exists: boolean }> {
    if (!email) {
      throw new BadRequestException('Email обязателен для проверки');
    }
    const exists = await this.userService.checkEmailExists(email);
    return { exists };
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Авторизация' })
  @ApiResponse({
    status: 200,
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Обновить токен пользователя' })
  @ApiHeader({ name: 'Bearer', required: true, description: 'Refresh token' })
  @ApiResponse({ status: 200, type: RefreshResponseDto })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход' })
  @ApiHeader({ name: 'Bearer', required: true, description: 'Refresh token' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.logout(refreshTokenDto);
  }
}
