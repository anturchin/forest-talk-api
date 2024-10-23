import { ApiProperty } from '@nestjs/swagger';

export class CreateUserGalleryDto {
  @ApiProperty({ type: 'string', description: 'Идентификатор пользователя' })
  user_id: number;

  @ApiProperty({ type: 'string', description: 'Путь до картинки в формате "https://example.com"' })
  img_url: string;
}
