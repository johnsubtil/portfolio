export type HistoryMode = 'pushState' | 'replaceState';

export function createCatalogFilterUrl(values: Record<string, string>, page: number) {
  const url = new URL(window.location.href);
  const parameters = { ...values, page: page > 1 ? String(page) : '' };
  Object.entries(parameters).forEach(([name, value]) => {
    if (value) url.searchParams.set(name, value);
    else url.searchParams.delete(name);
  });
  return url;
}

export function updateCatalogFilterUrl(url: URL, mode: HistoryMode) {
  if (url.href !== window.location.href) window.history[mode](window.history.state, '', url);
}
