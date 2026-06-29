# Show Management Plan

## Goal

Let Noah and approved collaborators add or update shows without touching git, while keeping the public website static and avoiding any server-side runtime.

## Recommended Architecture

Use a private Google Form and Google Sheet as the editing surface, then let GitHub Actions read the Sheet during deployment and generate a static `data/shows.json` file for the site.

```text
Google Form -> private Google Sheet -> GitHub Actions -> data/shows.json -> GitHub Pages
```

Form submissions land in `Form Responses 1`. The curated `Shows` tab mirrors the submitted fields into columns A:I and leaves `Status` in column J as the manual approval control.

This keeps all credentials inside GitHub Actions, keeps the website static, and avoids exposing the raw Sheet to visitors.

## Why This Approach

- Noah can add shows from a familiar form UI.
- Only invited Google users can edit the form or Sheet.
- The Sheet can stay private instead of being published to the web.
- GitHub Actions can use a read-only Google service account secret.
- The deployed site has no server, database, or runtime dependency on Google.
- The generated JSON can be validated, sorted, and filtered before deployment.

## Data Model

The form should collect:

| Field | Required | Notes |
| --- | --- | --- |
| Show date | Yes | Use a real date field. |
| Venue | Yes | Public venue name. |
| City | Yes | City for display. |
| State or region | Yes | Use two-letter state for US shows when possible. |
| Doors time | No | Display only when provided. |
| Show time | No | Display only when provided. |
| Ticket URL | No | Primary call to action when available. |
| Event URL | No | Useful for Facebook, venue pages, or RSVP links. |
| Notes | No | Short public note only. |
| Status | Yes | `draft`, `published`, or `canceled`. |

The build should publish only rows with `Status = published`, unless canceled shows are intentionally displayed. Shows should remain visible through the day after the show date, then be hidden automatically.

## Google Setup

1. Create a Google Form called `Noah Desimone and the Revival Shows`.
2. Link the form responses to a private Google Sheet.
3. Add a curated tab named `Shows`.
4. Keep raw form responses in the default response tab.
5. Mirror submitted public fields into `Shows` columns A:I.
6. Set `Status` manually in column J.
7. Share the Sheet only with approved editors.

The `Shows` tab should be treated as the source of truth for the website.

## GitHub Actions Authentication

Use a Google Cloud service account with read-only access:

1. Create a Google Cloud project.
2. Enable the Google Sheets API.
3. Create a service account.
4. Create a JSON key for that service account.
5. Share the private Sheet with the service account email as a viewer.
6. Store the JSON key in GitHub Actions as `GOOGLE_SERVICE_ACCOUNT_JSON`.
7. Store the Sheet ID as `GOOGLE_SHEET_ID`.

The website should never receive these credentials. They are only used inside GitHub Actions.

## Build Process

The repo includes `scripts/build-shows.mjs`, which:

1. Authenticates with Google Sheets using `GOOGLE_SERVICE_ACCOUNT_JSON`.
2. Reads rows from the `Shows` tab.
3. Validates required fields.
4. Filters unpublished rows.
5. Keeps shows through one day after the show date, then hides older dates.
6. Sorts visible shows by date ascending.
7. Writes normalized data to `data/shows.json`.

Example output:

```json
[
  {
    "date": "2026-08-14",
    "venue": "The Basement",
    "city": "Nashville",
    "state": "TN",
    "doors": "7:00 PM",
    "time": "8:00 PM",
    "ticketUrl": "https://example.com",
    "eventUrl": "",
    "notes": ""
  }
]
```

## Workflow Plan

The deploy workflow runs on pushes, manually, and on a schedule:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "17 * * * *"
```

The workflow should:

1. Check out the repo.
2. Run the no-dependency Google Sheet sync script.
3. Prepare the static site artifact.
4. Upload the Pages artifact.
5. Deploy to GitHub Pages.

Hourly is enough for show listings. Manual dispatch covers urgent changes.

If `GOOGLE_SERVICE_ACCOUNT_JSON` or `GOOGLE_SHEET_ID` is missing, the sync step writes an empty `data/shows.json` file.

The sync does not commit generated JSON back to the repository. It writes `data/shows.json` in the temporary Actions workspace, copies that file into the Pages artifact, and deploys the artifact.

## Website Integration

Keep the frontend simple:

1. Add a `Shows` section to `index.html`.
2. Fetch `/data/shows.json` with a small client-side script.
3. Render upcoming shows into semantic HTML.
4. Show a quiet empty state when there are no published upcoming shows.
5. Keep the page usable if the JSON request fails.

This avoids adopting a framework before the site actually needs one.

## Security Notes

- Do not publish the Sheet to the web if using service account auth.
- Do not commit Google credentials.
- Give the service account viewer access only.
- Keep private notes out of the `Shows` tab.
- Treat every field in `Shows` as public website content.

## Implementation Phases

1. Create the private Google Form and Sheet.
2. Create the Google service account and GitHub Actions secrets.
3. Add `scripts/build-shows.mjs` and `data/shows.json`. Done.
4. Update the deploy workflow to generate shows before publishing. Done.
5. Add the public Shows section to the site. Done.
6. Test draft, published, canceled, missing URL, no-upcoming-shows, same-day, next-day, and older-than-one-day cases.
