# Contributing to Nox

First off — **thank you** for taking the time to contribute. 🌙
Whether it's a bug report, a fix for a site that looks wrong, better docs, a translation, or just an idea, every contribution helps.

This is a small, no-build, vanilla-JavaScript extension, so getting set up takes about a minute.

## 🧭 Ways to contribute

You don't have to write code to help:

- 🐛 **Report bugs** — sites where dark mode looks broken, the toggle misbehaving, etc. ([Open a bug report](.github/ISSUE_TEMPLATE/bug_report.md))
- 💡 **Suggest features** — ignore-list improvements, scheduling, site-specific rules… ([Request a feature](.github/ISSUE_TEMPLATE/feature_request.md))
- 🌍 **Translate the popup UI** into your language.
- 📝 **Improve the docs / README** — clearer wording, better install steps, screenshots.
- ⭐ **Star & share** the repo — helps other people find it.
- 💻 **Submit code** — see below.

## 🚀 Getting set up to code

There is **no build step, no dependencies, no bundler**.

1. **Fork & clone** this repository.
2. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`, …).
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the project folder.
5. The extension loads. To see changes after you edit a file, click the **reload ↻** icon on the extension card (and reload any open tab you're testing on).

### Where things live

| File | What it does |
|------|--------------|
| `manifest.json` | Extension declaration (Manifest V3). |
| `content.js` | The core logic — injects the dark-mode CSS filter and reacts to storage changes. |
| `background.js` | Service worker; seeds defaults on install only. |
| `popup.html` / `popup.css` / `popup.js` | The toolbar popup UI and its logic. |
| `icons/` | Icons + source artwork. |

## 🧪 Testing

There's no automated test suite today, so please **test manually on the known-hard sites** before opening a PR:

- **GitHub** (`github.com`) — code blocks, diffs, syntax highlighting.
- **Google Docs / Sheets / Slides** (`docs.google.com`) — toolbars and the canvas.
- A content-heavy news site with lots of `<img>` and background images.
- A site with a lot of `<canvas>` or `<video>`.

Make sure that:

- Toggling dark mode on/off updates **already-open tabs** live (not just after a reload).
- Adding/removing a site on the ignore list takes effect immediately.
- Nothing throws in the extension's DevTools console (Inspect views: service worker / content script).

## 📏 Code style

To match the existing code:

- **Vanilla JS, no framework, no transpile.** Keep it dependency-free.
- Prefer the existing patterns: state in `chrome.storage.sync` as the source of truth, `storage.onChanged` as the primary update channel, the popup message as a best-effort nudge.
- Leave the helpful comments in place — they explain *why* something is done a specific way (e.g. why we don't wipe storage on update).
- Minimal permissions. If your change needs a new permission, call it out in the PR and explain why there's no narrower alternative.

## 📥 Submitting a pull request

1. Create a branch: `git checkout -b fix/short-description`.
2. Make your change. Keep the diff focused — one logical change per PR.
3. Test manually on the sites above.
4. If you're fixing a specific issue, reference it (`Closes #123`).
5. Fill in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).

Good first PRs are tagged [`good first issue`](../../labels/good%20first%20issue) — start there if you're new to the codebase.

## 💬 Questions & ideas

For anything that isn't a bug or feature request, feel free to [open a discussion](../../discussions) (if enabled) or just open an issue labeled `question`.

## 📜 Code of conduct

By participating you agree to uphold the [Code of Conduct](CODE_OF_CONDUCT.md). Be kind, be patient, assume good intent.

---

Thanks again for helping make the web easier on the eyes. 🌙
