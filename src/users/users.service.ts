import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isDate, parseISO } from 'date-fns';

import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { User } from './users.entity';
import { DEFAULT_CACHE_TTL, ErrorMessages } from '../constants';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from '../interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly redisService: RedisService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkIfUserExistsByEmail(createUserDto.email);

    const user = this.usersRepository.create({
      ...createUserDto,
      created_at: new Date(),
    });

    let savedUser: User;

    try {
      savedUser = await this.usersRepository.save(user);
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new ConflictException(ErrorMessages.USER_CREATION_ERROR);
    }

    try {
      await this.redisService.delete(RedisKeys.USER_LIST);

      const cacheKey = `${RedisKeys.USER_KEY_PREFIX}${savedUser.user_id}`;
      await this.redisService.set(cacheKey, JSON.stringify(savedUser));
    } catch (e) {
      this.logger.warn(`Cache error: ${e.message}`);
    }

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    try {
      const cachedUsers = await this.redisService.get(RedisKeys.USER_LIST);
      if (cachedUsers) return JSON.parse(cachedUsers) as User[];
    } catch (e) {
      this.logger.warn(`Cache error: ${e.message}`);
    }

    let users: User[] = [];

    try {
      users = await this.usersRepository.find();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new ConflictException(ErrorMessages.USER_LIST_ERROR);
    }

    try {
      await this.redisService.saveWithExpiry(
        RedisKeys.USER_LIST,
        JSON.stringify(users),
        DEFAULT_CACHE_TTL
      );
    } catch (e) {
      this.logger.warn(e.message);
    }
    return users;
  }

  async findOne(id: number): Promise<User> {
    this.validateId(id);
    const cachedKey = `${RedisKeys.USER_KEY_PREFIX}${id}`;
    try {
      const cachedUser = await this.redisService.get(cachedKey);
      if (cachedUser) {
        return JSON.parse(cachedUser) as User;
      }
    } catch (e) {
      this.logger.warn(e.message, e.stack);
    }

    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      this.logger.warn(ErrorMessages.USER_NOT_FOUND(id));
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));
    }
    try {
      await this.redisService.set(cachedKey, JSON.stringify(user));
    } catch (e) {
      this.logger.warn(e.message, e.stack);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      this.logger.error(ErrorMessages.USER_NOT_FOUND(id));
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.checkIfUserExistsByEmail(updateUserDto.email);
    }

    const updatedUser = this.constructUpdatedUser(updateUserDto);

    if (updateUserDto.last_login) {
      const parsedDate = parseISO(updateUserDto.last_login as unknown as string);
      if (!isDate(parsedDate) || isNaN(parsedDate.getTime())) {
        this.logger.error(ErrorMessages.INVALID_LAST_LOGIN);
        throw new BadRequestException(ErrorMessages.INVALID_LAST_LOGIN);
      }
      updatedUser.last_login = updateUserDto.last_login;
    }

    try {
      const cachedKey = `${RedisKeys.USER_KEY_PREFIX}${id}`;
      await this.redisService.delete(cachedKey);
    } catch (e) {
      this.logger.warn(e.message, e.stack);
    }
    await this.usersRepository.update(id, updatedUser);

    const newUser = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!newUser) {
      this.logger.error(ErrorMessages.USER_NOT_FOUND(id));
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));
    }

    try {
      const cacheKeyNew = `${RedisKeys.USER_KEY_PREFIX}${newUser.user_id}`;
      await this.redisService.set(cacheKeyNew, JSON.stringify(newUser));
      await this.redisService.delete(RedisKeys.USER_LIST);
    } catch (e) {
      this.logger.warn(e.message, e.stack);
    }

    return newUser;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    try {
      await this.usersRepository.delete(id);
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw new ConflictException(ErrorMessages.USER_DELETION_ERROR);
    }

    try {
      const cacheKey = `${RedisKeys.USER_KEY_PREFIX}${id}`;
      await this.redisService.delete(cacheKey);
      await this.redisService.delete(RedisKeys.USER_LIST);
    } catch (e) {
      this.logger.warn(e.message, e.stack);
    }
  }

  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      this.logger.error(ErrorMessages.INVALID_ID);
      throw new BadRequestException(ErrorMessages.INVALID_ID);
    }
  }

  private constructUpdatedUser(updateUserDto: UpdateUserDto): Partial<User> {
    const updatedUser: Partial<User> = {};

    if (updateUserDto.email) {
      updatedUser.email = updateUserDto.email;
    }

    if (updateUserDto.password_hash) {
      updatedUser.password_hash = updateUserDto.password_hash;
    }

    if (updateUserDto.is_online !== undefined) {
      if (typeof updateUserDto.is_online === 'boolean') {
        updatedUser.is_online = updateUserDto.is_online;
      } else {
        this.logger.error(ErrorMessages.INVALID_IS_ONLINE);
        throw new BadRequestException(ErrorMessages.INVALID_IS_ONLINE);
      }
    }

    return updatedUser;
  }

  private async checkIfUserExistsByEmail(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      this.logger.error(ErrorMessages.EMAIL_ALREADY_EXISTS);
      throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }
  }
}
