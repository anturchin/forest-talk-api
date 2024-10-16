import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { ErrorMessages, SuccessMessages } from '../common/constants';
import { ProfileService } from '../users/profile/profile.service';
import { JwtPayload } from '../common/interfaces';
import { User } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService
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

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password_hash } = loginDto;

    const user = await this.validateUser({ email, password_hash });

    const payload: JwtPayload = { sub: user.user_id as number, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'JWT_REFRESH_SECRET',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const { refresh_token } = refreshTokenDto;

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refresh_token, { secret: 'JWT_REFRESH_SECRET' });
    } catch {
      throw new UnauthorizedException('Невалидный refresh token');
    }

    const user = await this.findUser(payload);

    const accessToken = await this.jwtService.signAsync(
      { sub: user.user_id },
      { expiresIn: '15m' }
    );

    return { accessToken };
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    console.log(refreshTokenDto);
  }

  async findUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    return user;
  }

  private async validateUser({
    email,
    password_hash,
  }: {
    email: string;
    password_hash: string;
  }): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);

      if (user && user.password_hash !== password_hash) {
        throw new UnauthorizedException('Неверный email или пароль');
      }
      return user;
    } catch {
      throw new UnauthorizedException('Пользователь не найден');
    }
  }
}
