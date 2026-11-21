import { prepareSearchIndex, type SearchEntry, type SearchIndex } from './engine';

const indexes = new Map<string, Promise<SearchIndex>>();

export function loadSearchIndex(url: string) {
  let index = indexes.get(url);
  if (!index) {
    index = fetch(url)
      .then(async (response) => {
        if (!response.ok) throw new Error(`Search index unavailable: ${response.status}`);
        const entries: SearchEntry[] = await response.json();
        return prepareSearchIndex(entries);
      })
      .catch((error) => {
        indexes.delete(url);
        throw error;
      });
    indexes.set(url, index);
  }
  return index;
}

function createPlaceholderIcon() {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  icon.setAttribute('viewBox', '0 0 48 48');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.75');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');
  const frame = document.createElementNS(namespace, 'rect');
  frame.setAttribute('x', '6');
  frame.setAttribute('y', '9');
  frame.setAttribute('width', '36');
  frame.setAttribute('height', '30');
  frame.setAttribute('rx', '4');
  const sun = document.createElementNS(namespace, 'circle');
  sun.setAttribute('cx', '17');
  sun.setAttribute('cy', '20');
  sun.setAttribute('r', '3.5');
  const hills = document.createElementNS(namespace, 'path');
  hills.setAttribute('d', 'M6 33l10-9 8 7 6-5 12 10');
  icon.append(frame, sun, hills);
  return icon;
}

export function createSearchLink(entry: SearchEntry, labels: { project: string; post: string }) {
  const link = document.createElement('a');
  link.className = 'search-result';
  link.href = entry.url;

  const thumb = document.createElement('span');
  thumb.className = 'search-result-thumb';
  thumb.setAttribute('aria-hidden', 'true');
  if (entry.cover?.src) {
    const image = document.createElement('img');
    image.src = entry.cover.src;
    image.alt = '';
    image.loading = 'lazy';
    thumb.append(image);
  } else {
    thumb.dataset.placeholder = '';
    thumb.append(createPlaceholderIcon());
  }

  const meta = document.createElement('span');
  meta.className = 'search-result-meta';
  meta.textContent = [labels[entry.type], entry.context].filter(Boolean).join(' · ');

  const title = document.createElement('span');
  title.className = 'search-result-title';
  title.textContent = entry.title;

  const description = document.createElement('span');
  description.className = 'search-result-description';
  description.textContent = entry.description;

  link.append(thumb, meta, title, description);
  return link;
}
