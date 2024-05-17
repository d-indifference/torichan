import { generatePassword } from '@utils/misc';

export const setPasswordFromCookies = (cookies: Record<string, unknown>) => {
  if (!cookies['torichanPass']) {
    return generatePassword();
  }

  return cookies['torichanPass'] as string;
};
