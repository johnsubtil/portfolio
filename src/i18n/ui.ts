import type { Locale } from './locales';
import portuguese from './messages/pt-br.json';
import english from './messages/en-us.json';

const translations: Record<Locale, typeof portuguese> = {
  'pt-br': portuguese,
  'en-us': english,
};

export function getUI(locale: Locale) {
  return translations[locale];
}
