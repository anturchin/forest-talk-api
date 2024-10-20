import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { ErrorMessages, SEVEN_DAYS_IN_SECONDS, SuccessMessages } from '../common/constants';
import { ProfileService } from '../users/profile/profile.service';
import { JwtPayload, RefreshToken } from '../common/interfaces';
import { User } from '../users/entities/users.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
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
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.saveRefreshTokenToRedis({
      id: user.user_id,
      refreshToken,
      expires: SEVEN_DAYS_IN_SECONDS,
    });

    return { accessToken, refreshToken };
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    const { refresh_token } = refreshTokenDto;

    let payload: JwtPayload;

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    try {
      payload = await this.jwtService.verifyAsync(refresh_token, {
        secret: refreshSecret,
        ignoreExpiration: false,
      });

      const storedToken = await this.redisService.get(`refresh_token:${payload.sub}`);
      if (!storedToken || storedToken !== refresh_token) {
        throw new UnauthorizedException('Невалидный refresh token');
      }
    } catch {
      throw new UnauthorizedException('Невалидный refresh token');
    }

    const user = await this.findUser(payload);

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');

    const accessToken = await this.jwtService.signAsync(
      { sub: user.user_id, email: user.email },
      { secret: accessSecret, expiresIn: '15m' }
    );

    const newRefreshToken = await this.jwtService.signAsync(
      { sub: user.user_id, email: user.email },
      {
        secret: refreshSecret,
        expiresIn: '7d',
      }
    );

    await this.saveRefreshTokenToRedis({
      id: user.user_id,
      refreshToken: newRefreshToken,
      expires: SEVEN_DAYS_IN_SECONDS,
    });

    return { accessToken, newRefreshToken };
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    const { refresh_token } = refreshTokenDto;

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        ignoreExpiration: false,
      });

      await this.redisService.delete(`refresh_token:${payload.sub}`);
      this.logger.log(`Refresh token deleted for user ${payload.sub}`);
    } catch (e) {
      this.logger.warn(`Failed to delete refresh token: ${e.message}`);
      throw new UnauthorizedException('Ошибка при выходе');
    }
  }

  async findUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    return user;
  }

  private async validateUser({ email, password_hash }: LoginDto): Promise<User> {
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

  private async saveRefreshTokenToRedis({
    id,
    refreshToken,
    expires,
  }: RefreshToken): Promise<void> {
    try {
      await this.redisService.saveWithExpiry(`refresh_token:${id}`, refreshToken, expires);
    } catch (e) {
      this.logger.warn(`Cache error: ${e.message}`);
    }
  }
}
