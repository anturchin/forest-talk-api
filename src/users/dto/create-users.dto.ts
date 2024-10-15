import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  active = 'active',
  deleted = 'deleted',
}

export class CreateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Хеш пароля пользователя' })
  @IsNotEmpty()
  password_hash: string;

  @ApiProperty({
    description: 'Статус пользователя',
  })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: 'Последний вход', type: 'string', format: 'date-time' })
  last_login?: Date;
}
