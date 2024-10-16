import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { ErrorMessages, SuccessMessages } from '../common/constants';
import { ProfileService } from '../users/profile/profile.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly profileService: ProfileService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password_hash, ...profile } = registerDto;

    try {
      const { user_id } = await this.userService.create({ email, password_hash });

      try {
        await this.profileService.create({ user_id: user_id, ...profile });
        return { message: SuccessMessages.USER_CREATE_SUCCESS };
      } catch (e) {
        this.logger.error(e.message);
        throw new ConflictException(ErrorMessages.PROFILE_CREATION_ERROR);
      }
    } catch (e) {
      this.logger.error(e.message);
      throw new ConflictException(e.message);
    }
  }

  async login(loginDto: LoginDto) {
    console.log(loginDto);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<void> {
    console.log(refreshTokenDto);
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    console.log(refreshTokenDto);
  }
}
