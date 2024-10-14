import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ type: 'string', description: 'Refresh token' })
  refresh_token: string;
}
