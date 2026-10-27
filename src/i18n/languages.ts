import { en, type Messages } from './locales/en';
import { th } from './locales/th';

export const languages = ['en', 'th'] as const;

export type Language = (typeof languages)[number];

export const messages: Record<Language, Messages> = { en, th };

/** Each language's name in itself, so people can find theirs whichever is active. */
export const languageNames: Record<Language, string> = {
  en: 'English',
  th: 'ไทย',
};
