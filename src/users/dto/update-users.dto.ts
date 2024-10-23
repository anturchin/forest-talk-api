import { IsDateString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from './create-users.dto';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'lebowski@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Неверный формат email' })
  email?: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: '2cf24dba5fb0a30e26e83b2ac5b9e291b161615c1fa7425e73043362938b9824',
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
