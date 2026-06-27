# Noah DeSimone and the Revival Website

Static website for Noah DeSimone and the Revival at www.noahdesimoneandtherevival.com.

## Current Status

The repository has completed Phase 3 and is in Phase 4 custom-domain setup. The site serves a polished coming-soon page and deploys through GitHub Actions to GitHub Pages.

## Deployment

Pushes to `main` deploy the static site to GitHub Pages through `.github/workflows/deploy.yml`.

Temporary GitHub Pages URL:

https://pilhlip211.github.io/Noahs-Website/

Canonical custom domain:

https://www.noahdesimoneandtherevival.com/

Redirect domain:

https://noahandtherevival.com/

https://www.noahandtherevival.com/

## Local Preview

Open `index.html` in a browser, or run a small local server:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Roadmap

See [roadmap.md](roadmap.md).
