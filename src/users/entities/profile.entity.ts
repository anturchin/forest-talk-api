import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({ type: 'string', description: 'Отчество пользователя', required: false })
  patronymic?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата рождения пользователя',
    required: false,
  })
  birth_date?: Date;

  @ApiProperty({ type: 'string', description: 'Аватар пользователя', required: false })
  avatar_url?: string;

  @ApiProperty({ type: 'string', description: 'Биография пользователя', required: false })
  bio?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания профиля',
    required: false,
  })
  updated_at: Date;
}
