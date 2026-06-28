# Noah Desimone & The Revival Website

Static website for Noah Desimone & The Revival at www.noahdesimoneandtherevival.com.

## Current Status

The repository has a first real one-page site with bio copy, social links, music/show coming-soon states, and upcoming shows loaded from `data/shows.json`. It deploys through GitHub Actions to GitHub Pages.

The next planned feature is a no-server show management flow where Noah can add shows through a private Google Form/Sheet and GitHub Actions generates the static show data for the website.

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

Run a small local server so the shows JSON file can be loaded:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Updating Shows

Edit `data/shows.json` and add future dates in this format:

```json
[
  {
    "date": "2026-08-15",
    "venue": "Venue Name",
    "city": "Pensacola",
    "state": "FL",
    "time": "8:00 PM",
    "venueUrl": "https://example.com",
    "ticketUrl": "https://example.com/tickets",
    "notes": "Optional note"
  }
]
```

Required fields are `date`, `venue`, `city`, and `state`. If no future shows are listed, the site displays a coming-soon message.

## Show Management Plan

See [docs/show-management-plan.md](docs/show-management-plan.md).
