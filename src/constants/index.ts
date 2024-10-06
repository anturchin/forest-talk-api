export const DEFAULT_SALT = 10;

export const ErrorMessages = {
  INVALID_ID: 'Некорректный формат для поля id, должно быть число',
  USER_NOT_FOUND: (id: number) => `Пользователь с id ${id} не найден`,
  INVALID_LAST_LOGIN: 'Некорректный формат даты для поля last_login',
  INVALID_IS_ONLINE: 'Некорректный формат для поля is_online, должно быть булево',
  EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
};
