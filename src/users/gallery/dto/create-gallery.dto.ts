import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserGalleryDto {
  @ApiProperty({ type: 'string', description: 'Идентификатор пользователя' })
  @IsNotEmpty({ message: 'Поле user_id не должен быть пустым' })
  user_id: number;

  @ApiProperty({ type: 'string', description: 'Путь до картинки в формате "https://example.com"' })
  @IsNotEmpty({ message: 'Поле img_url не должен быть пустым' })
  img_url: string;
}
