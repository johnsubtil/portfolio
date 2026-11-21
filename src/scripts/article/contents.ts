export function initializeArticleContents() {
  document.querySelectorAll<HTMLElement>('[data-article-contents]').forEach((navigation) => {
    const details = navigation.querySelector('details');
    const summary = details?.querySelector('summary');
    if (!details || !summary) return;

    const compact = window.matchMedia('(width < 1488px)');
    const updateLayout = () => {
      details.open = !compact.matches;
      summary.tabIndex = compact.matches ? 0 : -1;
    };
    summary.addEventListener('click', (event) => {
      if (!compact.matches) event.preventDefault();
    });
    compact.addEventListener('change', updateLayout);
    updateLayout();
  });
}
