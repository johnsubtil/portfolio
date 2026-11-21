import { supportedLocales, type Locale } from '../../i18n/locales';

export function contentLocale(id: string): Locale {
  const prefix = id.split('/')[0];
  if (!supportedLocales.includes(prefix as Locale)) {
    throw new Error(`Content must live in a pt-br/ or en-us/ folder: ${id}`);
  }
  return prefix as Locale;
}

export function contentSlug(id: string) {
  contentLocale(id);
  const slug = id.slice(id.indexOf('/') + 1);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Content must use one lowercase, hyphen-separated filename: ${id}`);
  }
  return slug;
}
