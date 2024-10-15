import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string', description: 'Email пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', description: 'Хэш пароля пользователя' })
  @IsNotEmpty()
  password_hash: string;
}
