import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { ProfileModule } from '../users/profile/profile.module';

@Module({
  imports: [UsersModule, ProfileModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
