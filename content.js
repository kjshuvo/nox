// Nox — content script.
// Applies a GPU-composited invert+hue-rotate filter to <html>, and re-applies
// the same filter to media elements so photos/videos keep their original look.
// State is driven entirely by chrome.storage.sync; the popup message is a
// best-effort nudge (chrome.storage.onChanged is the primary update channel).

const STYLE_ID = '__nox_style__';
const ACTIVE_CLASS = 'nox-active';

// One injected stylesheet. Class-scoped under html.nox-active so it auto-applies
// to dynamically-added <img>/<video>/etc. (no per-element loops, no observers).
// Limitation: CSS background-image on plain elements can't be un-inverted
// cheaply; most photos are <img>, so the visible hit is small.
const CSS = `
html.${ACTIVE_CLASS}{background-color:#fff !important;color-scheme:dark !important;filter:invert(1) hue-rotate(180deg) !important}
html.${ACTIVE_CLASS} img,html.${ACTIVE_CLASS} picture,html.${ACTIVE_CLASS} video,html.${ACTIVE_CLASS} canvas,html.${ACTIVE_CLASS} iframe,html.${ACTIVE_CLASS} svg,html.${ACTIVE_CLASS} embed,html.${ACTIVE_CLASS} object{filter:invert(1) hue-rotate(180deg) !important}
`;

// Single source of truth for defaults: dark mode is ON when `enabled` is unset.
function normalize(result) {
  return {
    enabled: result.enabled === undefined ? true : result.enabled,
    ignoredSites: Array.isArray(result.ignoredSites) ? result.ignoredSites : []
  };
}

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  // <html> exists even at document_start and lasts for the document lifetime.
  document.documentElement.appendChild(style);
}

function applyState(state) {
  const shouldApply = state.enabled && !state.ignoredSites.includes(window.location.hostname);
  document.documentElement.classList.toggle(ACTIVE_CLASS, shouldApply);
}

function readAndApply() {
  chrome.storage.sync.get(['enabled', 'ignoredSites'], (result) => {
    applyState(normalize(result));
  });
}

// Popup nudge (best-effort; storage.onChanged is the reliable path).
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'update') {
    readAndApply();
  }
  return false; // synchronous, no sendResponse
});

// Primary update channel: fires in every tab when settings change, even on
// tabs where the popup message can't be delivered.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && ('enabled' in changes || 'ignoredSites' in changes)) {
    readAndApply();
  }
});

injectStyle();
readAndApply();
