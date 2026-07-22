# Nox landing page (`gh-pages`)

This branch holds **only** the marketing site, served at
**https://kjshuvo.github.io/nox/**. The extension source lives on `main`.

## Update the site
1. Edit files in this branch.
2. `git push origin gh-pages`.
3. GitHub Pages rebuilds in ~30s.

## Notes
- Served as a **project** Pages site at `/nox/`, so local assets use relative paths
  and all SEO metadata URLs use the full `https://kjshuvo.github.io/nox` path.
- No custom domain / `CNAME` — uses the default GitHub Pages URL.

## Local preview
```bash
python3 -m http.server 8090
# open http://127.0.0.1:8090/
```
