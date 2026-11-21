import { createSearchLink, loadSearchIndex } from '../../lib/search/client';
import { searchEntries } from '../../lib/search/engine';
import { createCatalogPagination, readCatalogPage } from '../catalog/pagination';
import { createCatalogFilterUrl, updateCatalogFilterUrl } from '../catalog/url';

export function initializeSearchPage() {
  const page = document.querySelector<HTMLElement>('[data-search-page]');
  const input = page?.querySelector<HTMLInputElement>('input');
  const form = page?.querySelector('form');
  const results = page?.querySelector<HTMLElement>('[data-search-results]');
  const status = page?.querySelector<HTMLElement>('[role="status"]');
  const empty = page?.querySelector<HTMLElement>('[data-search-empty]');

  if (page && input && form && results && status && empty && page.dataset.indexUrl) {
    status.hidden = false;
    const indexUrl = page.dataset.indexUrl;
    const labels = {
      project: page.dataset.projectLabel ?? '',
      post: page.dataset.postLabel ?? '',
    };
    let requestVersion = 0;
    let currentQuery = '';
    let currentPage = 1;
    let resultItems: HTMLElement[] = [];
    const loadingMessage = status.textContent;
    const navigation = page.querySelector<HTMLElement>('[data-catalog-pagination]');
    const getUrl = (requestedPage: number) => createCatalogFilterUrl({ q: currentQuery }, requestedPage);
    const renderPage = createCatalogPagination(page, {
      urlForPage: getUrl,
      onPageChange: (requestedPage) => {
        currentPage = renderPage(resultItems, requestedPage);
        updateCatalogFilterUrl(getUrl(currentPage), 'pushState');
        results.querySelector<HTMLAnchorElement>('li:not([hidden]) a')?.focus({ preventScroll: true });
        results.scrollIntoView({ block: 'start' });
      },
    });

    const showResults = async () => {
      const version = ++requestVersion;
      const query = currentQuery;
      status.textContent = loadingMessage;
      results.replaceChildren();
      empty.hidden = true;
      if (navigation) navigation.hidden = true;
      try {
        const index = await loadSearchIndex(indexUrl);
        if (version !== requestVersion) return;
        const matches = searchEntries(index, query);
        resultItems = matches.map((entry) => {
          const item = document.createElement('li');
          item.append(createSearchLink(entry, labels));
          return item;
        });
        results.replaceChildren(...resultItems);
        currentPage = renderPage(resultItems, currentPage);
        updateCatalogFilterUrl(getUrl(currentPage), 'replaceState');
        empty.hidden = matches.length !== 0;
        status.textContent = `${matches.length} ${matches.length === 1 ? page.dataset.one : page.dataset.many}`;
      } catch {
        if (version !== requestVersion) return;
        results.replaceChildren();
        resultItems = [];
        if (navigation) navigation.hidden = true;
        empty.hidden = true;
        status.textContent = page.dataset.error ?? '';
      }
    };

    const restoreQuery = () => {
      const params = new URL(window.location.href).searchParams;
      currentQuery = params.get('q') ?? '';
      currentPage = readCatalogPage(params.get('page'));
      input.value = currentQuery;
      void showResults();
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      currentQuery = input.value.trim();
      input.value = currentQuery;
      currentPage = 1;
      updateCatalogFilterUrl(getUrl(currentPage), 'pushState');
      void showResults();
    });
    window.addEventListener('popstate', restoreQuery);
    restoreQuery();
  }
}
