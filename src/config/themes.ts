export const themes = [
  { id: 'dark-lab', themeColor: '#0A0E14', colorScheme: 'dark' },
  { id: 'golden-royal', themeColor: '#0B0806', colorScheme: 'dark' },
] as const;

type ThemeId = (typeof themes)[number]['id'];

export const defaultTheme: ThemeId = 'dark-lab';
export const initialTheme = themes.find((theme) => theme.id === defaultTheme) ?? themes[0];
export const themeStorageKey = 'john-theme';
