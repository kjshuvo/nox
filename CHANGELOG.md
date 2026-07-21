# Changelog

All notable changes to **Nox** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-21

First public release.

### Added
- One-click global dark-mode toggle for every website.
- Single GPU-composited `invert(1) hue-rotate(180deg)` filter; media elements (`img`, `video`, `canvas`, `iframe`, `svg`, …) are re-inverted so photos and videos keep their original colours.
- Per-site ignore list — keep chosen domains in their original theme.
- Preferences sync across devices through `chrome.storage.sync`.
- Live updates in already-open tabs via `storage.onChanged`.
- Minimal permissions (`activeTab`, `storage`) — no telemetry, no network requests.

[1.0.0]: https://github.com/kjshuvo/nox/releases/tag/v1.0.0
