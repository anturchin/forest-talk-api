import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshAuthGuard } from '../common/guards/refresh-auth.guard';
import { SuccessMessages } from '../common/constants';
import { CheckEmailDto, RegisterDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RefreshResponseDto, RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('../common/guards/refresh-auth.guard');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refresh: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            checkEmailExists: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(RefreshAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('контроллер должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен вернуть сообщение при успешном создании пользователя', async () => {
    const mockMessage = { message: SuccessMessages.USER_CREATE_SUCCESS };
    jest.spyOn(authService, 'register').mockResolvedValue(mockMessage);

    const newUser: RegisterDto = {
      email: 'lebowski@mail.ru',
      password_hash: '12345678',
      first_name: 'ann',
      last_name: 'lebowski',
    };

    const result = await controller.register(newUser);
    expect(result).toEqual(mockMessage);
  });

  it('должен вернуть токены при успешном логине пользователя', async () => {
    const mockTokens: LoginResponseDto = { accessToken: '123', refreshToken: '321' };
    jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);

    const user: LoginDto = {
      email: 'lebowski@mail.ru',
      password_hash: '12345678',
    };

    const result = await controller.login(user);
    expect(result).toEqual(mockTokens);
  });

  it('должен вернуть токены при успешном обновлении refresh токена пользователя', async () => {
    const mockTokens: RefreshResponseDto = { accessToken: '123456', newRefreshToken: '654321' };
    jest.spyOn(authService, 'refresh').mockResolvedValue(mockTokens);

    const refreshToken: RefreshTokenDto = {
      refresh_token: '000000',
    };

    const result = await controller.refresh(refreshToken);
    expect(result).toEqual(mockTokens);
  });

  it('должен вернуть статус токена пользователя', async () => {
    jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

    const refreshToken: RefreshTokenDto = {
      refresh_token: '000000',
    };

    const result = await controller.logout(refreshToken);
    expect(result).toBeUndefined();
  });

  it('должен вернуть true, если email существует', async () => {
    const email = 'lebowski@gmail.com';
    jest.spyOn(userService, 'checkEmailExists').mockResolvedValue(true);

    const result = await controller.checkEmail({ email } as CheckEmailDto);
    expect(result).toEqual({ exists: true });
  });

  it('должен вернуть false, если email не существует', async () => {
    const email = 'lebowski@gmail.com';
    jest.spyOn(userService, 'checkEmailExists').mockResolvedValue(false);

    const result = await controller.checkEmail({ email } as CheckEmailDto);
    expect(result).toEqual({ exists: false });
  });

  it('должен выбросить исключение, если email не предоставлен', async () => {
    await expect(controller.checkEmail({ email: '' } as CheckEmailDto)).rejects.toThrow(
      new BadRequestException('Email обязателен для проверки')
    );
  });
});
