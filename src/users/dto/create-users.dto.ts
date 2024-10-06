import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Qwe123456!' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Статус онлайн', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  is_online?: boolean;

  @ApiProperty({ description: 'Последний вход', required: false })
  last_login?: Date;
}
