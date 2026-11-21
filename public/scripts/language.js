(() => {
  const script = document.currentScript;
  const settings = JSON.parse(script.dataset.settings);
  const ids = Object.keys(settings.locales);
  const known = (value) => ids.includes(value);

  let locale = new URLSearchParams(window.location.search).get('lang');
  if (!known(locale)) locale = ids.find((id) => window.location.pathname.split('/')[1] === settings.locales[id].path);

  if (!locale) {
    try {
      const saved = localStorage.getItem(settings.storageKey);
      if (known(saved)) locale = saved;
    } catch {}
  }

  if (!locale) {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const language of languages) {
      const code = String(language).toLowerCase().split('-')[0];
      locale = ids.find((id) => settings.locales[id].language.toLowerCase().split('-')[0] === code);
      if (locale) break;
    }
  }

  if (!locale) locale = settings.defaultLocale;

  if (script.dataset.action === 'redirect') {
    window.location.replace(settings.locales[locale].home + window.location.hash);
  } else {
    document.querySelectorAll('[data-locale]').forEach((message) => {
      message.hidden = message.dataset.locale !== locale;
    });
    document.documentElement.lang = settings.locales[locale].language;
  }
})();
