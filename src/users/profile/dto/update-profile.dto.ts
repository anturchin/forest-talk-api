import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ type: 'string', description: 'Имя пользователя', example: 'Борис' })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя', example: 'Лебовски' })
  @IsString()
  @IsOptional()
  last_name?: string;

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
