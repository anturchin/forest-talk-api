import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Хеш пароля пользователя' })
  @IsNotEmpty()
  password_hash: string;

  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({ type: 'string', description: 'Отчество пользователя' })
  patronymic?: string;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Дата рождения пользователя' })
  birth_date?: Date;

  @ApiProperty({ type: 'string', description: 'Аватар пользователя' })
  avatar_url?: string;

  @ApiProperty({ type: 'string', description: 'Биография пользователя' })
  bio?: string;
}
