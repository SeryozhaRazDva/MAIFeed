// Список username модераторов (без символа @)
const MODERATOR_USERNAMES = [
  'SeryozhaRazDva',
  'Kotyatyq',
  'ffedosick',
  'Alex_k_5887',
];

// Проверка является ли пользователь модератором
export const isModerator = (username: string | undefined): boolean => {
  if (!username) return false;
  // Убираем @ если есть, и приводим к нижнему регистру для сравнения
  const cleanUsername = username.replace('@', '').toLowerCase();
  return MODERATOR_USERNAMES.some(mod => mod.toLowerCase() === cleanUsername);
};

// Проверка авторизации через Telegram WebApp
export const isTelegramUser = (): boolean => {
  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user;
  
  // Проверяем что есть Telegram WebApp и пользователь авторизован
  return !!(webApp && user && user.id);
};

// Получить данные пользователя из Telegram
export const getTelegramUser = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
};
