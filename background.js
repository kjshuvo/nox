// Seed defaults only on a fresh install, never on update — otherwise we'd wipe
// the user's ignore list on every version bump. content.js's normalize() is the
// real safety net for unseeded storage, so this is best-effort convenience.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      enabled: true,
      ignoredSites: []
    });
  }
});
