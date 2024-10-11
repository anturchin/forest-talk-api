import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Хеш пароля пользователя' })
  @IsNotEmpty()
  password_hash: string;

  @ApiProperty({ description: 'Публичный ключ', example: 'Публичный ключ пользователя' })
  @IsNotEmpty()
  public_key: string;

  @ApiProperty({ description: 'Приватный ключ', example: 'Приватный ключ пользователя' })
  @IsNotEmpty()
  private_key: string;

  @ApiProperty({ description: 'Статус онлайн', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  is_online?: boolean;

  @ApiProperty({ description: 'Последний вход', required: false })
  last_login?: Date;
}
