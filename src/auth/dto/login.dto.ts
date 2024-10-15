import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({ type: 'string', description: 'Хэш пароля пользователя' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password_hash: string;
}
