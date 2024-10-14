import { ApiProperty } from '@nestjs/swagger';

export class UsersToken {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор токена' })
  token_id: number | bigint;

  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Access token' })
  access_token: string;

  @ApiProperty({ type: 'string', description: 'Refresh token' })
  refresh_token: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания токена',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Дата истечения токена' })
  expires_at: Date;
}
