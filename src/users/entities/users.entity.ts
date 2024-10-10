import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  user_id: number;

  @ApiProperty({ type: 'string', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ type: 'string', description: 'Хеш пароля пользователя' })
  password_hash: string;

  @ApiProperty({ type: 'string', description: 'Публичный ключ пользователя' })
  public_key: string;

  @ApiProperty({ type: 'string', description: 'Приватный ключ пользователя' })
  private_key: string;

  @ApiProperty({
    type: 'boolean',
    description: 'Статус пользователя (в сети/не в сети)',
    default: false,
  })
  is_online: boolean;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Время последнего входа пользователя',
  })
  last_login: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания пользователя',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
