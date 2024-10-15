import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  active = 'active',
  deleted = 'deleted',
}

export class CreateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', example: 'Хеш пароля пользователя' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password_hash: string;

  @ApiProperty({
    description: 'Статус пользователя',
    enum: UserStatus,
    example: UserStatus.active,
  })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({ description: 'Последний вход', type: 'string', format: 'date-time' })
  last_login?: Date;
}
