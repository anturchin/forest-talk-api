import { IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Хеш пароля пользователя',
    required: false,
  })
  @IsOptional()
  password_hash?: string;

  @ApiProperty({ description: 'Статус онлайн', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  is_online?: boolean;

  @ApiProperty({ description: 'Последний вход', required: false })
  @IsOptional()
  last_login?: Date;
}
