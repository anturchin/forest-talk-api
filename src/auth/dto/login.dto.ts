import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string', description: 'Email пользователя', example: 'lebowski@gmail.com' })
  @IsEmail({}, { message: 'Неверный формат email' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Хэш пароля пользователя',
    example: '2cf24dba5fb0a30e26e83b2ac5b9e291b161615c1fa7425e73043362938b9824',
  })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password_hash: string;
}

export class LoginResponseDto {
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoic2FueWFAZ21haWwuY29tIiwiaWF0IjoxNzI5NzEwMDY4LCJleHAiOjE3Mjk3OTY0Njh9.pD-Nf1Z31aIouDxVluOBNI6bDX_LIE6cvHm1SDfSVGw',
  })
  accessToken: string;
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoic2FueWFAZ21haWwuY29tIiwiaWF0IjoxNzI5NzEwMDY4LCJleHAiOjE3Mjk3OTY0Njh9.pD-Nf1Z31aIouDxVluOBNI6bDX_LIE6cvHm1SDfSVGw',
  })
  refreshToken: string;
}
