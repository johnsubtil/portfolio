import { localeSettings, type Locale } from '../../i18n/locales';

interface DatedContent {
  id: string;
  data: { updated: Date };
}

export function recentlyUpdatedFirst(left: DatedContent, right: DatedContent) {
  return right.data.updated.getTime() - left.data.updated.getTime()
    || left.id.localeCompare(right.id);
}

export function formatContentDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(localeSettings[locale].language, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date);
}
