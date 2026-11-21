import { normalizeSearch } from '../../lib/search/engine';
import { createCatalogPagination, readCatalogPage } from './pagination';
import { createCatalogFilterUrl, updateCatalogFilterUrl, type HistoryMode } from './url';

function restoreCatalogSelect(select: HTMLSelectElement, value: string | null) {
  select.value = value && Array.from(select.options).some((option) => option.value === value) ? value : 'all';
}

function bindCatalogFilterEvents(
  form: HTMLFormElement,
  searchInput: HTMLInputElement,
  selects: HTMLSelectElement[],
  actions: { commit: (mode: HistoryMode) => void; restoreFromUrl: () => void },
) {
  searchInput.addEventListener('input', () => actions.commit('replaceState'));
  selects.forEach((select) => {
    select.addEventListener('change', () => actions.commit('pushState'));
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    actions.commit('pushState');
  });
  form.addEventListener('reset', (event) => {
    event.preventDefault();
    searchInput.value = '';
    selects.forEach((select) => { select.value = 'all'; });
    actions.commit('pushState');
  });
  window.addEventListener('popstate', actions.restoreFromUrl);
}

interface CatalogFacet {
  name: string;
  hideWhenSingleChoice?: boolean;
}

interface CatalogFilterOptions {
  kind: 'post' | 'project';
  facets: CatalogFacet[];
}

export function initializeCatalogFilters({ kind, facets }: CatalogFilterOptions) {
  document.querySelectorAll<HTMLElement>(`[data-${kind}-list]`).forEach((list) => {
    const filterForm = list.querySelector<HTMLFormElement>(`.${kind}-filters`);
    const searchInput = filterForm?.querySelector<HTMLInputElement>('[name="q"]');
    if (!filterForm || !searchInput) return;

    const controls = facets.flatMap((facet) => {
      const select = filterForm.querySelector<HTMLSelectElement>(`[name="${facet.name}"]`);
      return select ? [{
        ...facet,
        select,
        field: select.closest<HTMLElement>('label'),
      }] : [];
    });
    if (controls.length !== facets.length) return;

    const status = list.querySelector<HTMLElement>(`.${kind}-status`);
    const empty = list.querySelector<HTMLElement>(`[data-${kind}-empty]`);
    const cards = Array.from(list.querySelectorAll<HTMLElement>(`[data-${kind}-card]`), (element) => ({
      element,
      values: Object.fromEntries(controls.map(({ name }) => [name, element.dataset[name]])),
      searchText: normalizeSearch(element.dataset.search ?? ''),
    }));
    const hasChoices = Object.fromEntries(controls.map(({ name }) => [
      name,
      new Set(cards.map(({ values }) => values[name])).size > 1,
    ]));
    let currentPage = 1;

    const getUrl = (page: number) => createCatalogFilterUrl(
      {
        q: searchInput.value.trim(),
        ...Object.fromEntries(controls.map(({ name, select }) => [name, select.value === 'all' ? '' : select.value])),
      },
      page,
    );
    const updateUrl = (mode: HistoryMode) => {
      updateCatalogFilterUrl(getUrl(currentPage), mode);
    };

    const renderPage = createCatalogPagination(list, {
      urlForPage: getUrl,
      onPageChange: (page) => {
        currentPage = page;
        updateResults();
        updateUrl('pushState');
        list.querySelector<HTMLElement>('.catalog-card:not([hidden]) a')?.focus({ preventScroll: true });
        list.querySelector('.catalog-grid')?.scrollIntoView({ block: 'start' });
      },
    });

    const updateResults = () => {
      let visibleFacets = 0;
      controls.forEach(({ name, select, field, hideWhenSingleChoice }) => {
        const show = !hideWhenSingleChoice || hasChoices[name] || select.value !== 'all';
        if (field) field.hidden = !show;
        if (show) visibleFacets += 1;
      });
      filterForm.dataset.facets = String(visibleFacets);

      const query = normalizeSearch(searchInput.value);
      const terms = query ? query.split(' ') : [];
      const matchingCards: HTMLElement[] = [];

      cards.forEach(({ element, values, searchText }) => {
        const matchesFacets = controls.every(({ name, select }) => select.value === 'all' || values[name] === select.value);
        const matchesQuery = terms.every((term) => searchText.includes(term));
        element.hidden = true;
        if (matchesFacets && matchesQuery) matchingCards.push(element);
      });
      const resultCount = matchingCards.length;
      currentPage = renderPage(matchingCards, currentPage);

      if (empty) empty.hidden = resultCount !== 0 || cards.length === 0;
      if (status) {
        const label = resultCount === 1 ? status.dataset.singular : status.dataset.plural;
        status.textContent = `${resultCount} ${label}`;
      }
    };

    const restoreFromUrl = () => {
      const params = new URL(window.location.href).searchParams;
      currentPage = readCatalogPage(params.get('page'));
      searchInput.value = params.get('q') ?? '';
      controls.forEach(({ name, select }) => restoreCatalogSelect(select, params.get(name)));
      updateResults();
      updateUrl('replaceState');
    };

    const commitFilters = (mode: HistoryMode) => {
      currentPage = 1;
      updateResults();
      updateUrl(mode);
    };

    bindCatalogFilterEvents(filterForm, searchInput, controls.map(({ select }) => select), {
      commit: commitFilters,
      restoreFromUrl,
    });
    restoreFromUrl();
    filterForm.hidden = false;
    if (status) status.hidden = false;
  });
}
