import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { isDate, parseISO } from 'date-fns';

import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { User } from './users.entity';
import { DEFAULT_SALT, ErrorMessages } from '../constants';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from '../interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkIfUserExistsByEmail(createUserDto.email);

    const passwordHash = await this.hashPassword(createUserDto.password);

    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: passwordHash,
      created_at: new Date(),
    });

    const savedUser = await this.usersRepository.save(user);

    await this.redisService.set(
      `${RedisKeys.USER_KEY_PREFIX}${savedUser.user_id}`,
      JSON.stringify(savedUser)
    );

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    this.validateId(id);

    const cachedUser = await this.redisService.get(`${RedisKeys.USER_KEY_PREFIX}${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));
    }
    await this.redisService.set(`${RedisKeys.USER_KEY_PREFIX}${id}`, JSON.stringify(user));
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      if (updateUserDto.email !== user.email) {
        await this.checkIfUserExistsByEmail(updateUserDto.email);
      }
    }

    const updatedUser = await this.constructUpdatedUser(updateUserDto);

    if (updateUserDto.last_login) {
      const parsedDate = parseISO(updateUserDto.last_login as unknown as string);
      if (!isDate(parsedDate) || isNaN(parsedDate.getTime())) {
        throw new BadRequestException(ErrorMessages.INVALID_LAST_LOGIN);
      }
      updatedUser.last_login = updateUserDto.last_login;
    }

    await this.usersRepository.update(id, updatedUser);
    const newUser = await this.findOne(id);

    await this.redisService.set(`${RedisKeys.USER_KEY_PREFIX}${id}`, JSON.stringify(newUser));
    return newUser;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);

    await this.redisService.delete(`${RedisKeys.USER_KEY_PREFIX}${id}`);
  }

  private validateId(id: number): void {
    if (typeof id !== 'number' || isNaN(id)) {
      throw new BadRequestException(ErrorMessages.INVALID_ID);
    }
  }

  private async constructUpdatedUser(updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const updatedUser: Partial<User> = {};

    if (updateUserDto.email) {
      updatedUser.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      updatedUser.password_hash = await this.hashPassword(updateUserDto.password);
    }

    if (updateUserDto.is_online !== undefined) {
      if (typeof updateUserDto.is_online === 'boolean') {
        updatedUser.is_online = updateUserDto.is_online;
      } else {
        throw new BadRequestException(ErrorMessages.INVALID_IS_ONLINE);
      }
    }

    return updatedUser;
  }

  private async checkIfUserExistsByEmail(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt: number = Number(this.configService.get('PASSWORD_SALT') || DEFAULT_SALT);
    return await bcrypt.hash(password, salt);
  }
}
