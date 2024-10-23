import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email пользователя', example: 'lebowski@gmail.com' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: '2cf24dba5fb0a30e26e83b2ac5b9e291b161615c1fa7425e73043362938b9824',
  })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password_hash: string;

  @ApiProperty({ type: 'string', description: 'Имя пользователя', example: 'Борис' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя', example: 'Лебовски' })
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой' })
  last_name: string;

  @ApiProperty({
    type: 'string',
    description: 'Отчество пользователя',
    required: false,
    example: 'Инноке́нтьевич',
  })
  @IsOptional()
  patronymic?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата рождения пользователя',
    required: false,
    example: '2024-10-16T14:30:45.123Z',
  })
  @IsOptional()
  birth_date?: Date;

  @ApiProperty({
    type: 'string',
    description: 'Аватар пользователя',
    required: false,
    example: 'https://ya.ru',
  })
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Биография пользователя',
    required: false,
    example: 'программер',
  })
  @IsOptional()
  bio?: string;
}

export class CheckEmailDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;
}
