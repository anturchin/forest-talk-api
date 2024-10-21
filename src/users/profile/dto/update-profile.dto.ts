import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  @IsString()
  @IsOptional()
  last_name?: string;

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
