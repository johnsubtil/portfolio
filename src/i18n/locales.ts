export const supportedLocales = ['pt-br', 'en-us'] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = 'pt-br';

export const localeSettings = {
  'pt-br': { path: 'pt-br', language: 'pt-BR', openGraph: 'pt_BR', label: 'Português', short: 'PT' },
  'en-us': { path: 'en-us', language: 'en-US', openGraph: 'en_US', label: 'English', short: 'EN' },
} as const;

export const routeSections = ['projects', 'posts', 'about', 'search'] as const;
type RouteSection = (typeof routeSections)[number];

export const routeSegments: Record<Locale, Record<RouteSection, string>> = {
  'pt-br': { projects: 'projetos', posts: 'posts', about: 'sobre', search: 'busca' },
  'en-us': { projects: 'projects', posts: 'posts', about: 'about', search: 'search' },
};

export const languageStorageKey = 'john-language';

export function getLocale(url: URL): Locale {
  const prefix = url.pathname.split('/')[1];
  return supportedLocales.find((locale) => localeSettings[locale].path === prefix) ?? defaultLocale;
}

export function getLocalePaths() {
  return supportedLocales.map((locale) => ({ params: { locale: localeSettings[locale].path } }));
}

export function localizedUrl(locale: Locale, pathname = '/') {
  const base = `/${localeSettings[locale].path}`;
  if (pathname === '/') return `${base}/`;
  const segments = pathname.split('/');
  const section = segments[1] as RouteSection;
  segments[1] = routeSegments[locale][section] ?? segments[1];
  return `${base}${segments.join('/')}`;
}

const localePrefix = new RegExp(`^/(${supportedLocales.map((locale) => localeSettings[locale].path).join('|')})(?=/|$)`);

export function unlocalizedPath(pathname: string) {
  const prefix = localePrefix.exec(pathname);
  if (!prefix) return pathname;
  const locale = prefix[1] as Locale;
  const segments = (pathname.slice(prefix[0].length) || '/').split('/');
  const section = routeSections.find((name) => routeSegments[locale][name] === segments[1]);
  if (section) segments[1] = section;
  return segments.join('/') || '/';
}

export const languageScriptSettings = {
  storageKey: languageStorageKey,
  defaultLocale,
  locales: Object.fromEntries(supportedLocales.map((locale) => [
    locale,
    { path: localeSettings[locale].path, language: localeSettings[locale].language, home: localizedUrl(locale) },
  ])),
};
