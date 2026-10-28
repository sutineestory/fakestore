import type { Language } from '@/i18n';

// Built once: creating an Intl formatter is far slower than using one.
const formatters: Record<Language, Intl.NumberFormat> = {
  en: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  th: new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'USD' }),
};

/** A USD price written the way the active language writes currency. */
export function formatPrice(price: number, language: Language): string {
  return formatters[language].format(price);
}
