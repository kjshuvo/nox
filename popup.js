document.addEventListener('DOMContentLoaded', async () => {
  const onOff = document.getElementById('on-off');
  const ignoreSite = document.getElementById('ignore-site');
  const removeSite = document.getElementById('remove-site');
  const statusSpan = document.querySelector('.toggle-group span');
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');

  // ---- Runtime i18n (manual language switching) ----
  // Chrome's chrome.i18n.getMessage() is locked to the browser UI locale and
  // cannot be changed at runtime. To let users switch languages from the popup
  // we load the message catalogs (_locales/<code>/messages.json) ourselves and
  // apply them to the DOM. The chosen locale is remembered per-browser.
  const LOCALES = [
    { code: 'en',    name: 'English' },
    { code: 'ar',    name: 'العربية' },
    { code: 'bn',    name: 'বাংলা' },
    { code: 'de',    name: 'Deutsch' },
    { code: 'es',    name: 'Español' },
    { code: 'fr',    name: 'Français' },
    { code: 'hi',    name: 'हिन्दी' },
    { code: 'ja',    name: '日本語' },
    { code: 'pt_BR', name: 'Português (Brasil)' },
    { code: 'ru',    name: 'Русский' },
    { code: 'zh_CN', name: '中文（简体）' },
  ];

  let currentMessages = {};
  let currentLocale = 'en';

  // Pick the locale to use: an explicit saved choice wins; otherwise fall back
  // to the browser UI locale (matching region, then just language), then 'en'.
  function resolveLocale(saved) {
    if (saved && LOCALES.some(l => l.code === saved)) return saved;
    const ui = (chrome.i18n.getUILanguage() || 'en').replace('-', '_');
    if (LOCALES.some(l => l.code === ui)) return ui;
    const base = ui.split('_')[0];
    const match = LOCALES.find(l => l.code === base || l.code.startsWith(base + '_'));
    return match ? match.code : 'en';
  }

  function t(key) {
    const entry = currentMessages[key];
    return entry && entry.message ? entry.message : key;
  }

  function getSavedLocale() {
    return new Promise(resolve => chrome.storage.local.get('locale', r => resolve(r.locale)));
  }

  // Apply the currently loaded catalog to every localized node, update the
  // document language/direction (Arabic is RTL), and refresh the status label
  // so it matches the toggle's state in the new language.
  function applyTranslations() {
    document.documentElement.lang = currentLocale.replace('_', '-');
    document.documentElement.dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
    });
    statusSpan.textContent = onOff.checked ? t('statusEnabled') : t('statusDisabled');
    langMenu.querySelectorAll('button').forEach(btn => {
      const active = btn.dataset.locale === currentLocale;
      btn.setAttribute('aria-current', active ? 'true' : 'false');
      btn.querySelector('.check').hidden = !active;
    });
  }

  async function loadLocale(locale) {
    currentLocale = locale;
    try {
      const res = await fetch(chrome.runtime.getURL(`_locales/${locale}/messages.json`));
      currentMessages = await res.json();
    } catch (e) {
      currentMessages = {}; // fall back to raw keys rather than crashing
    }
    applyTranslations();
  }

  function buildLangMenu() {
    langMenu.replaceChildren();
    LOCALES.forEach(({ code, name }) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.locale = code;
      btn.setAttribute('role', 'menuitem');

      const label = document.createElement('span');
      label.textContent = name;

      const check = document.createElement('span');
      check.className = 'check';
      check.setAttribute('aria-hidden', 'true');
      check.hidden = true;
      check.textContent = '✓';

      btn.appendChild(label);
      btn.appendChild(check);
      btn.addEventListener('click', () => {
        chrome.storage.local.set({ locale: code });
        loadLocale(code);
        closeLangMenu();
      });

      li.appendChild(btn);
      langMenu.appendChild(li);
    });
  }

  function openLangMenu() {
    langMenu.hidden = false;
    langBtn.setAttribute('aria-expanded', 'true');
  }
  function closeLangMenu() {
    langMenu.hidden = true;
    langBtn.setAttribute('aria-expanded', 'false');
  }

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (langMenu.hidden) openLangMenu(); else closeLangMenu();
  });
  document.addEventListener('click', (e) => {
    if (!langMenu.hidden && !langMenu.contains(e.target) && e.target !== langBtn) {
      closeLangMenu();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !langMenu.hidden) closeLangMenu();
  });

  buildLangMenu();

  // ---- Active tab + ignore list helpers ----
  // Resolve the active tab once and reuse it for both the hostname lookup and
  // the content-script nudge, so a click triggers a single tabs.query instead
  // of two. chrome://, about:, and Web Store pages expose no URL we can read;
  // there hostname is null and ignore-list ops become no-ops (not errors).
  function withActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      let hostname = null;
      if (tab && tab.url) {
        try {
          const parsed = new URL(tab.url);
          if (parsed.hostname) hostname = parsed.hostname;
        } catch (e) {
          hostname = null;
        }
      }
      callback(tab, hostname);
    });
  }

  // storage.onChanged is the primary channel, so this message is a best-effort
  // nudge. A missing listener (stale tab, chrome:// page, or script still
  // loading) rejects the promise — swallow it. The promise form (.catch)
  // suppresses the "Uncaught (in promise)" that chrome.runtime.lastError can't.
  function notify(tab) {
    if (tab) chrome.tabs.sendMessage(tab.id, { action: 'update' }).catch(() => {});
  }

  function setIgnoreButtons(isIgnored) {
    ignoreSite.hidden = isIgnored;
    removeSite.hidden = !isIgnored;
  }

  // Add or remove the active hostname from the ignore list, then nudge the page.
  function setIgnored(tab, hostname, add) {
    if (!hostname) return;
    chrome.storage.sync.get(['ignoredSites'], (result) => {
      const sites = result.ignoredSites || [];
      if (add === sites.includes(hostname)) return; // already in the desired state
      const next = add
        ? [...sites, hostname]
        : sites.filter(site => site !== hostname);
      chrome.storage.sync.set({ ignoredSites: next }, () => {
        notify(tab);
        setIgnoreButtons(add);
      });
    });
  }

  // Load saved settings and update UI
  await loadLocale(resolveLocale(await getSavedLocale()));
  withActiveTab((tab, hostname) => {
    chrome.storage.sync.get(['enabled', 'ignoredSites'], (result) => {
      const isEnabled = result.enabled === undefined ? true : result.enabled;
      onOff.checked = isEnabled;
      statusSpan.textContent = isEnabled ? t('statusEnabled') : t('statusDisabled');
      setIgnoreButtons(hostname ? (result.ignoredSites || []).includes(hostname) : false);
    });
  });

  // Save settings on change. Message the content script only after storage has
  // committed (storage.onChanged is the primary channel; this is best-effort).
  onOff.addEventListener('change', () => {
    const isEnabled = onOff.checked;
    statusSpan.textContent = isEnabled ? t('statusEnabled') : t('statusDisabled');
    chrome.storage.sync.set({ enabled: isEnabled }, () => {
      withActiveTab((tab) => notify(tab));
    });
  });

  ignoreSite.addEventListener('click', () =>
    withActiveTab((tab, hostname) => setIgnored(tab, hostname, true)));
  removeSite.addEventListener('click', () =>
    withActiveTab((tab, hostname) => setIgnored(tab, hostname, false)));
});
