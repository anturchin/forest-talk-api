import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: 'Id не должен быть пустым' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Имя пользователя', example: 'Борис' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя', example: 'Лебовски' })
  @IsString()
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой' })
  last_name: string;

  @ApiProperty({ type: 'string', description: 'Отчество пользователя', example: 'Инноке́нтьевич' })
  @IsString()
  @IsOptional()
  patronymic?: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата рождения пользователя',
    example: '2024-10-16T14:30:45.123Z',
  })
  @IsDateString()
  @IsOptional()
  birth_date?: Date;

  @ApiProperty({ type: 'string', description: 'Аватар пользователя', example: 'https://ya.ru' })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({ type: 'string', description: 'Биография пользователя', example: 'программер' })
  @IsString()
  @IsOptional()
  bio?: string;
}
