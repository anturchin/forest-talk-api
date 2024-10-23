import { ApiProperty } from '@nestjs/swagger';

export class UserGallery {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор картинки', example: 1 })
  img_id: number | bigint;

  @ApiProperty({ type: 'number', description: 'Идентификатор пользователя', example: 1 })
  user_id: number | bigint;

  @ApiProperty({
    type: 'string',
    description: 'Путь до картинки в формате "https://example.com"',
    example: 'https://example.com',
  })
  img_url: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания картинки',
    default: () => 'CURRENT_TIMESTAMP',
    required: false,
    example: '2024-10-16T14:30:45.123Z',
  })
  created_at: Date;
}
