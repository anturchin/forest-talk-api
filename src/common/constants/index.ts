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
};

export const SuccessMessages = {
  USER_CREATE_SUCCESS: 'Пользователь зарегистрирован успешно',
};

export const DEFAULT_CACHE_TTL = 3600;
export const SEVEN_DAYS_IN_SECONDS = 604800;
