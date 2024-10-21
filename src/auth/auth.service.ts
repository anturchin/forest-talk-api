import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { ErrorMessages, ONE_DAY_IN_SECONDS, SuccessMessages } from '../common/constants';
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
      expiresIn: '1d',
    });

    await this.saveRefreshTokenToRedis({
      id: user.user_id,
      refreshToken,
      expires: ONE_DAY_IN_SECONDS,
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
        throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);
      }
    } catch (e) {
      if (e instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(e.message);
      }
      throw new UnauthorizedException(e.message);
    }

    const { accessToken, newRefreshToken } = await this.generateNewRefreshToken(
      payload,
      refreshSecret
    );
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
      this.logger.log(`У пользователя с id ${payload.sub} удален refresh token`);
    } catch (e) {
      if (e instanceof InternalServerErrorException) {
        this.logger.warn(`Ошибка при удалении refresh token: ${e.message}`);
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async findUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException(ErrorMessages.USER_NOT_FOUND(payload.sub));
    return user;
  }

  private async generateNewRefreshToken(
    payload: JwtPayload,
    refreshSecret: string
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
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
        expiresIn: '1d',
      }
    );

    await this.saveRefreshTokenToRedis({
      id: user.user_id,
      refreshToken: newRefreshToken,
      expires: ONE_DAY_IN_SECONDS,
    });

    return { accessToken, newRefreshToken };
  }

  private async validateUser({ email, password_hash }: LoginDto): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);

      if (user && user.password_hash !== password_hash) {
        throw new UnauthorizedException(ErrorMessages.INVALID_PASSWORD_OR_EMAIL);
      }
      return user;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException(e.message);
      }
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
      if (e instanceof InternalServerErrorException) {
        this.logger.warn(`Cache error: ${e.message}`);
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
