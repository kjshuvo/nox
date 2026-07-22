# Security Policy

## Supported versions

Nox is a small, dependency-free extension. Fixes are applied to the latest release only.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a vulnerability

If you think you've found a security issue, **please don't open a public issue**. Report it privately instead:

- Open a [private security advisory](https://github.com/kjshuvo/nox/security/advisories/new) on GitHub, **or**
- Contact the maintainer via the [KJ Shuvo GitHub profile](https://github.com/kjshuvo).

Please include a description, steps to reproduce, and the browser + version where it happened. You'll get an acknowledgement and credit in the advisory if you'd like.

## Posture

- **No network requests** — the extension never makes outbound calls.
- **No telemetry or analytics** — nothing is collected or transmitted.
- **Minimal permissions** — only `activeTab` and `storage`. See the [README privacy section](README.md#-privacy).
- **Strict Content Security Policy** — `script-src 'self'; object-src 'self'` (see `manifest.json`). No remote code, no `eval`, and no inline scripts can ever execute.
- **No dependencies or build step** — what's in this repository is exactly what runs in the browser.
