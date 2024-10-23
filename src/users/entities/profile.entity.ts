import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя', example: 1 })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Имя пользователя', example: 'Борис' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя', example: 'Лебовски' })
  last_name: string;

  @ApiProperty({
    type: 'string',
    description: 'Отчество пользователя',
    required: false,
    example: 'Инноке́нтьевич',
  })
  patronymic?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата рождения пользователя',
    required: false,
    example: '2024-10-16T14:30:45.123Z',
  })
  birth_date?: Date;

  @ApiProperty({
    type: 'string',
    description: 'Аватар пользователя',
    required: false,
    example: 'https://ya.ru',
  })
  avatar_url?: string;

  @ApiProperty({
    type: 'string',
    description: 'Биография пользователя',
    required: false,
    example: 'алкоголик',
  })
  bio?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания профиля',
    required: false,
  })
  updated_at: Date;
}
