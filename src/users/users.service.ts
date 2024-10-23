import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto, UserStatus } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { DEFAULT_CACHE_TTL, ErrorMessages } from '../common/constants';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from '../common/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { serializeObjBigInt } from '../common/utils/serialize.utils';
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
    await this.checkIfUserExistsByEmail(createUserDto.email);

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

    return serializeObjBigInt(savedUser, ErrorMessages.USER_SERIALIZATION_ERROR);
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

    const serializedUsers = users.map((user) =>
      serializeObjBigInt(user, ErrorMessages.USER_SERIALIZATION_ERROR)
    );

    try {
      await this.redisService.saveWithExpiry(
        RedisKeys.USER_LIST,
        JSON.stringify(serializedUsers),
        DEFAULT_CACHE_TTL
      );
    } catch (e) {
      this.logger.warn(e.message);
    }
    return serializedUsers;
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

    const serializedUser = serializeObjBigInt(user as User, ErrorMessages.USER_SERIALIZATION_ERROR);

    try {
      await this.redisService.saveWithExpiry(
        cachedKey,
        JSON.stringify(serializedUser),
        DEFAULT_CACHE_TTL
      );
    } catch (e) {
      this.logger.warn(e.message);
    }
    return serializedUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const cachedKey = `${RedisKeys.USER_KEY_PREFIX}${id}`;
    await this.updateUser(id, updateUserDto);

    try {
      await this.redisService.delete(cachedKey);
      await this.redisService.delete(RedisKeys.USER_LIST);
    } catch (e) {
      this.logger.warn(e.message);
    }

    const newUser = (await this.prisma.user.findUnique({ where: { user_id: id } })) as User;
    if (!newUser) {
      this.logger.error(ErrorMessages.USER_NOT_FOUND(id));
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND(id));
    }

    return serializeObjBigInt(newUser, ErrorMessages.USER_SERIALIZATION_ERROR);
  }

  async remove(id: number): Promise<void> {
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

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException(ErrorMessages.USER_NOT_FOUND_BY_EMAIL(email));
    return serializeObjBigInt(user as User, ErrorMessages.USER_SERIALIZATION_ERROR);
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
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

    const { status, ...updateUser } = updateUserDto;
    const statIsValid = status === UserStatus.active || status === UserStatus.deleted;
    try {
      await this.prisma.user.update({
        where: { user_id: id },
        data: statIsValid ? updateUserDto : updateUser,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new BadRequestException(ErrorMessages.USER_UPDATING_ERROR);
    }
  }

  private async checkIfUserExistsByEmail(email: string): Promise<void> {
    const userExists = await this.checkEmailExists(email);
    if (userExists) throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
  }
}
