import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Хеш пароля пользователя' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password_hash: string;

  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой' })
  last_name: string;

  @ApiProperty({ type: 'string', description: 'Отчество пользователя', required: false })
  @IsOptional()
  patronymic?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата рождения пользователя',
    required: false,
  })
  @IsOptional()
  birth_date?: Date;

  @ApiProperty({ type: 'string', description: 'Аватар пользователя', required: false })
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({ type: 'string', description: 'Биография пользователя', required: false })
  @IsOptional()
  bio?: string;
}
