import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { ProfileModule } from '../users/profile/profile.module';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RedisModule } from '../redis/redis.module';
import { JWT_ACCESS_SECRET } from '../common/constants';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    RedisModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_ACCESS_SECRET),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
