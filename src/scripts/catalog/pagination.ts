const pageSize = 9;

interface PaginationActions {
  urlForPage: (page: number) => URL;
  onPageChange: (page: number) => void;
}

export function readCatalogPage(value: string | null) {
  if (!value || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export function createCatalogPagination(container: HTMLElement, actions: PaginationActions) {
  const navigation = container.querySelector<HTMLElement>('[data-catalog-pagination]');
  if (!navigation) throw new Error('Catalog pagination controls are missing.');

  navigation.addEventListener('click', (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-page]');
    if (!link) return;
    event.preventDefault();
    actions.onPageChange(Number(link.dataset.page));
  });

  const pageLink = (page: number, label: string, currentPage: number) => {
    const link = document.createElement('a');
    link.href = actions.urlForPage(page).href;
    link.dataset.page = String(page);
    link.textContent = label;
    if (page === currentPage) link.setAttribute('aria-current', 'page');
    return link;
  };

  const directionLink = (direction: 'previous' | 'next', page: number, currentPage: number) => {
    const label = navigation.dataset[direction] ?? '';
    const link = pageLink(page, label, currentPage);
    link.dataset.direction = direction;
    link.setAttribute('aria-label', label);
    return link;
  };

  return (entries: HTMLElement[], requestedPage: number) => {
    const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
    const start = (currentPage - 1) * pageSize;
    entries.forEach((entry, index) => {
      entry.hidden = index < start || index >= start + pageSize;
    });
    navigation.replaceChildren();
    navigation.hidden = totalPages === 1;
    if (totalPages === 1) return currentPage;

    if (currentPage > 1) navigation.append(directionLink('previous', currentPage - 1, currentPage));

    const visibleCount = Math.min(4, totalPages);
    const firstPage = Math.min(Math.max(1, currentPage - 1), totalPages - visibleCount + 1);
    for (let page = firstPage; page < firstPage + visibleCount; page += 1) {
      const link = pageLink(page, String(page), currentPage);
      link.setAttribute('aria-label', (navigation.dataset.pageLabel ?? '').replace('{page}', String(page)));
      navigation.append(link);
    }

    if (currentPage < totalPages) navigation.append(directionLink('next', currentPage + 1, currentPage));

    const summary = document.createElement('span');
    summary.className = 'catalog-page-summary';
    summary.textContent = (navigation.dataset.summary ?? '')
      .replace('{current}', String(currentPage))
      .replace('{total}', String(totalPages));
    navigation.append(summary);
    return currentPage;
  };
}
