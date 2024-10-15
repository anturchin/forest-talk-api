import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from './create-users.dto';

export class UpdateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
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

  @ApiProperty({
    description: 'Статус пользователя',
  })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: 'Последний вход', type: 'string', format: 'date-time' })
  @IsOptional()
  last_login?: Date;
}
