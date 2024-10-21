import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ type: 'string', description: 'Refresh token' })
  @IsNotEmpty({ message: 'refresh_token не должен быть пустым' })
  refresh_token: string;
}

export class RefreshResponseDto {
  @ApiProperty({ type: 'string' })
  accessToken: string;
  @ApiProperty({ type: 'string' })
  newRefreshToken: string;
}
