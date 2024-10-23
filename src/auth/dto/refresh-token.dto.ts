import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    type: 'string',
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsImVtYWlsIjoic2FueWFAZ21haWwuY29tIiwiaWF0IjoxNzI5NzEwMDY4LCJleHAiOjE3Mjk3OTY0Njh9.pD-Nf1Z31aIouDxVluOBNI6bDX_LIE6cvHm1SDfSVGw',
  })
  @IsNotEmpty({ message: 'refresh_token не должен быть пустым' })
  refresh_token: string;
}

export class RefreshResponseDto {
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
  newRefreshToken: string;
}
