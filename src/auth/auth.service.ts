import { Injectable } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async login(loginDto: LoginDto) {
    console.log(loginDto);
  }
  async register(registerDto: RegisterDto): Promise<void> {
    console.log(registerDto);
  }
  async refresh(refreshTokenDto: RefreshTokenDto): Promise<void> {
    console.log(refreshTokenDto);
  }
  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    console.log(refreshTokenDto);
  }
}
