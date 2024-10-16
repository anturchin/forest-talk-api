import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiResponse({ status: 200, description: 'Пользователь успешно авторизовался' })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновить токен пользователя' })
  @ApiResponse({ status: 200, description: 'Токен пользователя успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Выход' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно вышел из системы' })
  @ApiResponse({ status: 400, description: 'Неверные данные запроса (Bad Request)' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера (Internal Server Error)' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.logout(refreshTokenDto);
  }
}
