export const ErrorMessages = {
  INVALID_USER_ID: 'Некорректный формат для поля id, должно быть число',
  USER_NOT_FOUND: (id: number) => `Пользователь с id ${id} не найден`,
  INVALID_LAST_LOGIN: 'Некорректный формат даты для поля last_login',
  INVALID_IS_ONLINE: 'Некорректный формат для поля is_online, должно быть булево',
  EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
  USER_NOT_FOUND_BY_EMAIL: (email: string) => `Пользователь с таким email ${email} не существует`,
  USER_CREATION_ERROR: 'Ошибка при создании пользователя',
  USER_UPDATING_ERROR: 'Ошибка при обновлении пользователя',
  PROFILE_CREATION_ERROR: 'Ошибка при создании профиля',
  USER_LIST_ERROR: 'Ошибка при получении списка пользователей',
  USER_DELETION_ERROR: 'Ошибка при удалении пользователя',
  PROFILE_DELETION_ERROR: 'Ошибка при удалении профиля пользователя',
  USER_SERIALIZATION_ERROR: 'Ошибка при сериализации объекта пользователя',
  PROFILE_SERIALIZATION_ERROR: 'Ошибка при сериализации объекта профиль',
  INVALID_REFRESH_TOKEN: 'Невалидный refresh token',
  INVALID_PASSWORD_OR_EMAIL: 'Неверный email или пароль',
  INVALID_VALIDATE_USER: 'Пользователь не найден',
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера: Redis недоступен',
};

export const SuccessMessages = {
  USER_CREATE_SUCCESS: 'Пользователь зарегистрирован успешно',
};

export const REDIS_CLIENT = 'RedisClient';
export const DEFAULT_CACHE_TTL = 3600;
export const ONE_DAY_IN_SECONDS = 86400;

export const JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET';
export const JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET';
