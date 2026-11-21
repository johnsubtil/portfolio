export interface SearchEntry {
  type: 'project' | 'post';
  title: string;
  description: string;
  context: string;
  url: string;
  body: string;
  updated: string;
  cover?: { src: string; alt: string };
}

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function prepareSearchIndex(entries: SearchEntry[]) {
  return [...entries].sort((left, right) =>
    Date.parse(right.updated) - Date.parse(left.updated) || left.url.localeCompare(right.url),
  ).map((entry) => ({
    entry,
    text: normalizeSearch(`${entry.title} ${entry.description} ${entry.context} ${entry.body}`),
  }));
}

export type SearchIndex = ReturnType<typeof prepareSearchIndex>;

export function searchEntries(index: SearchIndex, query: string) {
  const normalized = normalizeSearch(query);
  if (!normalized) return index.map(({ entry }) => entry);

  const terms = normalized.split(' ');
  return index
    .filter((document) => terms.every((term) => document.text.includes(term)))
    .map(({ entry }) => entry);
}
