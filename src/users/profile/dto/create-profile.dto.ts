import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ type: 'number', description: 'Уникальный идентификатор пользователя' })
  @IsNumber()
  @IsNotEmpty({ message: 'Id не должен быть пустым' })
  user_id: number | bigint;

  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  @IsString()
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой' })
  last_name: string;

  @ApiProperty({ type: 'string', description: 'Отчество пользователя' })
  @IsString()
  @IsOptional()
  patronymic?: string;

  @ApiProperty({ type: 'string', format: 'date-time', description: 'Дата рождения пользователя' })
  @IsDateString()
  @IsOptional()
  birth_date?: Date;

  @ApiProperty({ type: 'string', description: 'Аватар пользователя' })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({ type: 'string', description: 'Биография пользователя' })
  @IsString()
  @IsOptional()
  bio?: string;
}
