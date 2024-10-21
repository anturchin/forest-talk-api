import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { UserStatus } from '../dto/create-users.dto';

export class User {
  @ApiProperty({
    type: 'number',
    description: 'Уникальный идентификатор пользователя',
    required: false,
  })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Email пользователя', required: false })
  email: string;

  @ApiProperty({ type: 'string', description: 'Хеш пароля пользователя', required: false })
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
