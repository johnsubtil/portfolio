import { createSearchLink, loadSearchIndex } from '../../lib/search/client';
import { searchEntries } from '../../lib/search/engine';

export function initializeHeaderSearch() {
  document.querySelectorAll<HTMLDetailsElement>('[data-header-search]').forEach((search) => {
    const input = search.querySelector<HTMLInputElement>('input');
    const toggle = search.querySelector('summary');
    const form = search.querySelector('form');
    const dropdown = search.querySelector<HTMLElement>('.search-suggestions');
    const list = search.querySelector<HTMLElement>('[role="listbox"]');
    const status = search.querySelector<HTMLElement>('[role="status"]');
    const allResults = search.querySelector<HTMLAnchorElement>('.all-results');
    if (!input || !toggle || !form || !dropdown || !list || !status || !allResults) return;
    if (!search.dataset.indexUrl) return;

    const indexUrl = search.dataset.indexUrl;
    const labels = {
      project: search.dataset.projectLabel ?? '',
      post: search.dataset.postLabel ?? '',
    };
    let suggestions: HTMLAnchorElement[] = [];
    let activeIndex = -1;
    let requestVersion = 0;

    const selectSuggestion = (index: number) => {
      activeIndex = index;
      suggestions.forEach((link, position) => {
        link.setAttribute('aria-selected', String(position === index));
      });
      const selected = suggestions[index];
      if (selected) {
        input.setAttribute('aria-activedescendant', selected.id);
        selected.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    };

    const clearSuggestions = () => {
      suggestions = [];
      selectSuggestion(-1);
      list.replaceChildren();
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    };

    const updateSuggestions = async () => {
      const version = ++requestVersion;
      const query = input.value.trim();
      clearSuggestions();
      dropdown.hidden = !query;
      allResults.hidden = !query;
      const destination = new URL(form.action);
      if (query) destination.searchParams.set('q', query);
      allResults.href = destination.href;
      if (!query) {
        status.textContent = search.dataset.hint ?? '';
        return;
      }

      status.textContent = search.dataset.loading ?? '';
      try {
        const index = await loadSearchIndex(indexUrl);
        if (version !== requestVersion || !search.open) return;
        const matches = searchEntries(index, query);
        suggestions = matches.slice(0, 6).map((entry, position) => {
          const link = createSearchLink(entry, labels);
          link.id = `header-suggestion-${position}`;
          link.setAttribute('role', 'option');
          link.setAttribute('aria-selected', 'false');
          link.tabIndex = -1;
          const item = document.createElement('li');
          item.setAttribute('role', 'presentation');
          item.append(link);
          list.append(item);
          return link;
        });
        list.hidden = suggestions.length === 0;
        input.setAttribute('aria-expanded', String(suggestions.length > 0));
        status.textContent = matches.length
          ? `${matches.length} ${matches.length === 1 ? search.dataset.one : search.dataset.many}`
          : search.dataset.empty ?? '';
      } catch {
        if (version === requestVersion && search.open) status.textContent = search.dataset.error ?? '';
      }
    };

    search.addEventListener('toggle', () => {
      const label = search.open ? toggle.dataset.closeLabel : toggle.dataset.openLabel;
      if (label) {
        toggle.setAttribute('aria-label', label);
        toggle.title = label;
      }
      if (!search.open) {
        requestVersion++;
        clearSuggestions();
        dropdown.hidden = true;
        return;
      }
      input.value = new URL(window.location.href).searchParams.get('q') ?? '';
      input.focus();
      void updateSuggestions();
    });

    input.addEventListener('input', () => { void updateSuggestions(); });
    input.addEventListener('keydown', (event) => {
      if (event.isComposing) return;
      if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && suggestions.length) {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        const count = suggestions.length;
        selectSuggestion(activeIndex < 0 && step < 0 ? count - 1 : (activeIndex + step + count) % count);
      } else if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        window.location.assign(suggestions[activeIndex].href);
      }
    });

    form.addEventListener('submit', () => { input.value = input.value.trim(); });
    search.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      search.open = false;
      toggle.focus();
    });

    document.addEventListener('click', (event) => {
      if (event.target instanceof Node && !search.contains(event.target)) search.open = false;
    });
  });
}
