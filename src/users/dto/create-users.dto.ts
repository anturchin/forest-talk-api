import { IsDateString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  active = 'active',
  deleted = 'deleted',
}

export class CreateUserDto {
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
