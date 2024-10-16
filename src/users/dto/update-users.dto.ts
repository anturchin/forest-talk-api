import { IsDateString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from './create-users.dto';

export class UpdateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'user@mail.ru', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат email' })
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
    enum: UserStatus,
    example: UserStatus.active,
    required: false,
  })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    description: 'Время последнего входа в формате ISO с точностью до миллисекунд',
    example: '2024-10-16T14:30:45.123Z',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Неверный формат даты. Ожидается ISO формат с миллисекундами.' })
  last_login?: Date;
}
