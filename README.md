# Noah Desimone & The Revival Website

Static website for Noah Desimone & The Revival at www.noahdesimoneandtherevival.com.

## Current Status

The repository has a first real one-page site with bio copy, social links, music/show coming-soon states, and upcoming shows loaded from `data/shows.json`. It deploys through GitHub Actions to GitHub Pages.

The show management flow uses a private Google Form and Google Sheet. GitHub Actions reads the curated `Shows` tab during deployment and writes the static `data/shows.json` file used by the website.

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

Submit shows through the private Google Form. The response Sheet mirrors submitted fields into the `Shows` tab; set `Status` to `published` on rows that should appear on the site. The generated `data/shows.json` file uses this shape:

```json
[
  {
    "date": "2026-08-15",
    "venue": "Venue Name",
    "city": "Pensacola",
    "state": "FL",
    "doors": "7:00 PM",
    "time": "8:00 PM",
    "eventUrl": "https://example.com/event",
    "ticketUrl": "https://example.com/tickets",
    "notes": "Optional note"
  }
]
```

Required fields are `date`, `venue`, `city`, `state`, and `status` in the Sheet. Shows older than yesterday are hidden automatically. If no future shows are listed, the site displays a coming-soon message.

## Google Sheet Sync

The deployment workflow runs `node scripts/build-shows.mjs` before publishing. If `GOOGLE_SERVICE_ACCOUNT_JSON` and `GOOGLE_SHEET_ID` are not set, the script writes an empty `data/shows.json` file so the deployed site still has valid show data.

Sheet edits do not create commits. The generated `data/shows.json` file is written inside the temporary GitHub Actions workspace and copied into the Pages artifact, so the live site changes without adding generated commits to the repo.

The curated Sheet tab must be named `Shows` and use these headers:

```text
Show date | Venue | City | State or region | Doors time | Show time | Ticket URL | Event URL | Notes | Status
```

Only rows with `Status` set to `published` are published. `draft` and `canceled` rows are ignored.

Required GitHub secrets:

```text
GOOGLE_SERVICE_ACCOUNT_JSON
GOOGLE_SHEET_ID
```

Optional GitHub variables:

```text
GOOGLE_SHEET_RANGE=Shows!A:K
SHOWS_TIME_ZONE=America/Chicago
```

## Show Management Plan

See [docs/show-management-plan.md](docs/show-management-plan.md).
