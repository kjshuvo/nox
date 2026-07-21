document.addEventListener('DOMContentLoaded', () => {
  const onOff = document.getElementById('on-off');
  const ignoreSite = document.getElementById('ignore-site');
  const removeSite = document.getElementById('remove-site');
  const statusSpan = document.querySelector('.toggle-group span');

  // Read the active tab's hostname safely. chrome://, about:, and Web Store
  // pages have no usable host (or no URL accessible to us); in that case we
  // yield null and the ignore-list operations become no-ops instead of throwing.
  function withHostname(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const raw = tabs[0] && tabs[0].url;
      let hostname = null;
      if (raw) {
        try {
          const parsed = new URL(raw);
          if (parsed.hostname) hostname = parsed.hostname;
        } catch (e) {
          hostname = null;
        }
      }
      callback(hostname);
    });
  }

  // Load saved settings and update UI
  withHostname((hostname) => {
    chrome.storage.sync.get(['enabled', 'ignoredSites'], (result) => {
      const isEnabled = result.enabled === undefined ? true : result.enabled;
      onOff.checked = isEnabled;
      statusSpan.textContent = isEnabled ? 'Enabled' : 'Disabled';
      const ignoredSites = result.ignoredSites || [];
      if (hostname && ignoredSites.includes(hostname)) {
        ignoreSite.hidden = true;
        removeSite.hidden = false;
      }
    });
  });

  // Save settings on change. Message the content script only after storage has
  // committed (storage.onChanged is the primary channel; this is best-effort).
  onOff.addEventListener('change', () => {
    const isEnabled = onOff.checked;
    statusSpan.textContent = isEnabled ? 'Enabled' : 'Disabled';
    chrome.storage.sync.set({ enabled: isEnabled }, () => {
      sendMessageToContentScript();
    });
  });

  ignoreSite.addEventListener('click', () => {
    withHostname((hostname) => {
      if (!hostname) return;
      chrome.storage.sync.get(['ignoredSites'], (result) => {
        const ignoredSites = result.ignoredSites || [];
        if (!ignoredSites.includes(hostname)) {
          ignoredSites.push(hostname);
          chrome.storage.sync.set({ ignoredSites: ignoredSites }, () => {
            sendMessageToContentScript();
            ignoreSite.hidden = true;
            removeSite.hidden = false;
          });
        }
      });
    });
  });

  removeSite.addEventListener('click', () => {
    withHostname((hostname) => {
      if (!hostname) return;
      chrome.storage.sync.get(['ignoredSites'], (result) => {
        let ignoredSites = result.ignoredSites || [];
        if (ignoredSites.includes(hostname)) {
          ignoredSites = ignoredSites.filter(site => site !== hostname);
          chrome.storage.sync.set({ ignoredSites: ignoredSites }, () => {
            sendMessageToContentScript();
            ignoreSite.hidden = false;
            removeSite.hidden = true;
          });
        }
      });
    });
  });

  function sendMessageToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      // storage.onChanged is the primary channel, so this message is a
      // best-effort nudge. A missing listener (stale tab, chrome:// page, or
      // script still loading) rejects the promise — swallow it. Use the
      // promise form (.catch) because the callback+lastError trick does not
      // suppress an "Uncaught (in promise)" rejection.
      chrome.tabs.sendMessage(tabs[0].id, { action: 'update' }).catch(() => {});
    });
  }
});
