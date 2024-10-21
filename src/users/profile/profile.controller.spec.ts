import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Profile } from '../entities/profile.entity';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../common/constants';
import { UpdateProfileDto } from './dto/update-profile.dto';

jest.mock('../../common/guards/jwt-auth.guard');

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('контроллер должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен вернуть профиль пользователя при успешном запросе', async () => {
    const mockProfile: Profile = {
      user_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      updated_at: new Date(),
    };
    jest.spyOn(profileService, 'findById').mockResolvedValue(mockProfile);

    const result = await controller.getProfile(1);
    expect(result).toEqual(mockProfile);
    expect(profileService.findById).toHaveBeenCalledWith(1);
  });

  it('должен выбросить NotFoundException, если профиль не найден', async () => {
    jest.spyOn(profileService, 'findById').mockResolvedValue(null);

    await expect(controller.getProfile(1)).rejects.toThrow(
      new NotFoundException(ErrorMessages.USER_NOT_FOUND(1))
    );
    expect(profileService.findById).toHaveBeenCalledWith(1);
  });

  it('должен успешно обновить профиль пользователя', async () => {
    const updateProfileDto: UpdateProfileDto = { first_name: 'John', last_name: 'Doe' };
    const updatedProfile: Profile = {
      user_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      updated_at: new Date(),
    };

    jest.spyOn(profileService, 'update').mockResolvedValue(updatedProfile);

    const result = await controller.updateProfile(1, updateProfileDto);
    expect(result).toEqual(updatedProfile);
    expect(profileService.update).toHaveBeenCalledWith(1, updateProfileDto);
  });
});
