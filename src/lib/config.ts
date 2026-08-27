export const config = {
  telegramUsername: process.env.TELEGRAM_ADMIN_USERNAME || process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || 'your_admin',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramAdminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
  telegramGroupChatId: process.env.TELEGRAM_GROUP_CHAT_ID || '',
  tiktokUsername: process.env.TIKTOK_USERNAME || process.env.NEXT_PUBLIC_TIKTOK_USERNAME || 'your_tiktok',
  facebookUrl: process.env.FACEBOOK_PAGE_URL || process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-12345',
  storeName: process.env.STORE_NAME || 'MineKeys',
};

export const TELEGRAM_ADMIN_USERNAME = config.telegramUsername;
export const TIKTOK_USERNAME = config.tiktokUsername;
export const FACEBOOK_PAGE_URL = config.facebookUrl;

export function getTelegramLink(message?: string) {
  const username = config.telegramUsername.replace('@', '');
  if (message) {
    return `https://t.me/${username}?text=${encodeURIComponent(message)}`;
  }
  return `https://t.me/${username}`;
}

export function getTelegramDirectLink() {
  const username = config.telegramUsername.replace('@', '');
  return `https://t.me/${username}`;
}
