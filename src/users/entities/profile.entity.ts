import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор профиля' })
  profile_id: number | bigint;

  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({ type: 'string', description: 'Отчество пользователя' })
  patronymic?: string;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Дата рождения пользователя' })
  birth_date?: Date;

  @ApiProperty({ type: 'string', description: 'Аватар пользователя' })
  avatar_url?: string;

  @ApiProperty({ type: 'string', description: 'Биография пользователя' })
  bio?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания профиля',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания профиля',
  })
  updated_at: Date;
}
