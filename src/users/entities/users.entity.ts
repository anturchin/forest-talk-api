import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { UserStatus } from '../dto/create-users.dto';

export class User {
  @ApiProperty({
    type: 'number',
    description: 'Уникальный идентификатор пользователя',
    required: false,
    example: 1,
  })
  user_id: number | bigint;

  @ApiProperty({
    type: 'string',
    description: 'Email пользователя',
    required: false,
    example: 'lebowski@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Хеш пароля пользователя',
    required: false,
    example: '2cf24dba5fb0a30e26e83b2ac5b9e291b161615c1fa7425e73043362938b9824',
  })
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
    type: 'string',
    format: 'date-time',
    description: 'Время последнего входа пользователя',
    required: false,
    example: '2024-10-16T14:30:45.123Z',
  })
  last_login?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания пользователя',
    default: () => 'CURRENT_TIMESTAMP',
    required: false,
  })
  created_at: Date;
}
