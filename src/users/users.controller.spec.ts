import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UserStatus } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn().mockResolvedValue({
        user_id: 1,
        password_hash: 'хэш',
      }),
      create: jest.fn().mockResolvedValue({
        user_id: 2,
        email: 'lebowski@tbank.com',
        password_hash: 'хэш',
        status: UserStatus.active,
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          user_id: 1,
          password_hash: 'хэш',
        },
        {
          user_id: 2,
          password_hash: 'хэш',
        },
      ]),
      remove: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue({
        user_id: 1,
        password_hash: 'новый хэш',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('контроллер должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен вернуть пользователя по запросу GET api/users/:id', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({
      user_id: 1,
      password_hash: 'хэш',
    });
  });

  it('должен создать пользователя через POST api/users', async () => {
    const createUserDto: CreateUserDto = {
      email: 'lebowski@tbank.com',
      password_hash: 'хэш',
      status: UserStatus.active,
    };

    const result = await controller.create(createUserDto);

    expect(result).toEqual({
      user_id: 2,
      email: 'lebowski@tbank.com',
      password_hash: 'хэш',
      status: UserStatus.active,
    });
    expect(result.email).toBe('lebowski@tbank.com');
    expect(result.password_hash).toBe('хэш');
  });

  it('должен вернуть список пользователей через GET api/users', async () => {
    const result = await controller.findAll();

    expect(result).toEqual([
      {
        user_id: 1,
        password_hash: 'хэш',
      },
      {
        user_id: 2,
        password_hash: 'хэш',
      },
    ]);
    expect(result.length).toBe(2);
  });

  it('должен удалить пользователя через DELETE api/users/:id', async () => {
    const result = await controller.remove(1);

    expect(result).toBeUndefined();
  });

  it('должен обновить пользователя через PATCH api/users/:id', async () => {
    const updateUserDto: UpdateUserDto = {
      password_hash: 'новый хэш',
    };

    const result = await controller.update(1, updateUserDto);

    expect(result).toEqual({
      user_id: 1,
      password_hash: 'новый хэш',
    });
  });
});
