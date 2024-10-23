import { ApiProperty } from '@nestjs/swagger';

export class UserGallery {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор картинки' })
  img_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Идентификатор пользователя' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Путь до картинки в формате "https://example.com"' })
  img_url: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания картинки',
    default: () => 'CURRENT_TIMESTAMP',
    required: false,
  })
  created_at: Date;
}
