(() => {
  const { themes, defaultTheme, storageKey } = JSON.parse(document.currentScript.dataset.settings);

  const apply = (id) => {
    const theme = themes.find((item) => item.id === id);
    if (!theme) return false;
    document.documentElement.dataset.theme = id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.themeColor);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme.colorScheme);
    document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.setAttribute('href', `/icons/favicon-${id}.svg`);
    return true;
  };

  let saved = null;
  try {
    saved = localStorage.getItem(storageKey);
  } catch {}
  if (!apply(saved)) apply(defaultTheme);

  window.applyTheme = (id) => {
    if (!apply(id)) return;
    try {
      localStorage.setItem(storageKey, id);
    } catch {}
  };
})();
