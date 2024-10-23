import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserGalleryDto {
  @ApiProperty({ type: 'number', description: 'Идентификатор пользователя', example: 1 })
  @IsNotEmpty({ message: 'Поле user_id не должен быть пустым' })
  @IsInt({ message: 'Поле user_id должно быть числом' })
  user_id: number;

  @ApiProperty({
    type: 'string',
    description: 'Путь до картинки в формате "https://ya.ru"',
    example: 'https://ya.ru',
  })
  @IsNotEmpty({ message: 'Поле img_url не должен быть пустым' })
  img_url: string;
}
