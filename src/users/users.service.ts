import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isDate, parseISO } from 'date-fns';

import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { DEFAULT_CACHE_TTL, ErrorMessages } from '../constants';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from '../interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from '../utils/serialize.utils';
import { User } from './entities/users.entity';
import { ProfileService } from './profile/profile.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly profileService: ProfileService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.email) await this.checkIfUserExistsByEmail(createUserDto.email);

    let savedUser: User;

    try {
      savedUser = (await this.prisma.user.create({
        data: createUserDto,
      })) as User;
    } catch (e) {
      this.logger.error(e.message);
      throw new ConflictException(ErrorMessages.USER_CREATION_ERROR);
    }

    try {
      await this.redisService.delete(RedisKeys.USER_LIST);
    } catch (e) {
      this.logger.warn(`Cache error: ${e.message}`);
    }

    return this.serializeBigInt(savedUser);
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
      users = (await this.prisma.user.findMany()) as User[];
    } catch {
      throw new ConflictException(ErrorMessages.USER_LIST_ERROR);
    }

    try {
      await this.redisService.saveWithExpiry(
        RedisKeys.USER_LIST,
        JSON.stringify(users, serializeBigInt),
        DEFAULT_CACHE_TTL
      );
    } catch (e) {
      this.logger.warn(e.message);
    }
    return users.map(this.serializeBigInt);
  }

  async findOne(id: number): Promise<User> {
    const cachedKey = `${RedisKeys.USER_KEY_PREFIX}${id}`;
    try {
      const cachedUser = await this.redisService.get(cachedKey);
      if (cachedUser) {
        return JSON.parse(cachedUser) as User;
      }
    } catch (e) {
      this.logger.warn(e.message);
    }

    const user = await this.prisma.user.findUnique({ where: { user_id: id } });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));

    try {
      await this.redisService.saveWithExpiry(
        cachedKey,
        JSON.stringify(user, serializeBigInt),
        DEFAULT_CACHE_TTL
      );
    } catch (e) {
      this.logger.warn(e.message);
    }
    return this.serializeBigInt(user as User);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.updateUser(id, updateUserDto);

    try {
      await this.redisService.delete(RedisKeys.USER_LIST);
    } catch (e) {
      this.logger.warn(e.message);
    }

    const newUser = (await this.prisma.user.findUnique({ where: { user_id: id } })) as User;
    if (!newUser) {
      this.logger.error(ErrorMessages.USER_NOT_FOUND(id));
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));
    }

    return this.serializeBigInt(newUser);
  }

  async remove(id: number): Promise<void> {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      throw new BadRequestException(ErrorMessages.INVALID_USER_ID);
    }
    const cachedKey = `${RedisKeys.USER_KEY_PREFIX}${id}`;
    await this.findOne(id);

    try {
      await this.profileService.delete(id);
    } catch {
      throw new ConflictException(ErrorMessages.PROFILE_DELETION_ERROR);
    }

    try {
      await this.prisma.user.delete({ where: { user_id: id } });
    } catch {
      throw new ConflictException(ErrorMessages.USER_DELETION_ERROR);
    }

    try {
      await this.redisService.delete(cachedKey);
      await this.redisService.delete(RedisKeys.USER_LIST);
    } catch (e) {
      this.logger.warn(e.message);
    }
  }

  private async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { user_id: id } });
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

    await this.prisma.user.update({
      where: { user_id: id },
      data: updatedUser,
    });
  }

  private serializeBigInt(user: User): User {
    try {
      return JSON.parse(JSON.stringify(user, serializeBigInt)) as User;
    } catch {
      throw new BadRequestException(ErrorMessages.USER_SERIALIZATION_ERROR);
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

    if (updateUserDto.status !== undefined) {
      updatedUser.status = updateUserDto.status;
    }

    return updatedUser;
  }

  private async checkIfUserExistsByEmail(email: string): Promise<void> {
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
  }
}
