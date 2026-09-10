# Valentin Duruisseaux — academic website

A dependency-free personal academic website for GitHub Pages. It uses semantic HTML, a single local stylesheet, a small progressive-enhancement script, and local imagery. No network connection is required to preview the site.

## Preview locally

From this directory, run:

```bash
make preview
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000). If `make` is unavailable, the equivalent command is:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

## Automated visual preview

On macOS with Google Chrome installed:

```bash
make capture
```

This starts a temporary local server and writes desktop, mobile, and long-page PNG previews for both pages to `previews/`. Set `PREVIEW_PORT` if port 8765 is already occupied.

## Check the site

```bash
make check
```

The dependency-free checker validates local links and anchors, required files, image alternative text, and the complete publication count.

## Publish

GitHub Pages user repositories publish from the `main` branch by default. Commit these files at the repository root and push to `origin/main`; the site will be available at `https://vduruiss.github.io/` after GitHub finishes the Pages build.

## Content notes

- The current NVIDIA Research appointment is supplied directly by Valentin Duruisseaux.
- The prior website, institutional profiles, publication venues, arXiv records, and public repositories were used to reconcile the content.
- Contact details and the prior CV are intentionally omitted from the public site.
