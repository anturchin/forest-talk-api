import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserStatus } from '../dto/create-users.dto';

export class User {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ type: 'string', description: 'Хеш пароля пользователя' })
  password_hash: string;

  @ApiProperty({
    description: 'Статус пользователя',
    enum: UserStatus,
    example: UserStatus.active,
  })
  @IsOptional()
  status?: UserStatus;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Время последнего входа пользователя',
  })
  last_login?: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания пользователя',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
