# Phase 5: First Real Band Site

## Objective

Replace the under-construction page with a polished one-page site for
Noah Desimone & The Revival.

## Current Site Sections

1. Hero
2. Live photo
3. Bio
4. Music
5. Shows
6. Social/contact footer

## Content Direction

- Use the official band name everywhere: Noah Desimone & The Revival.
- Positioning line: Pensacola, Florida's premier psychedelic blues act.
- Bio copy:
  "Noah Desimone & The Revival is Pensacola, Florida's premier psychedelic
  blues act. After performing in Blue Levee for nearly ten years, Noah Desimone
  is proud to continue electrifying Florida audiences with a unique blend of
  funk, acid rock, and blues."
- Music stays visible as "Music coming soon" until Spotify or other streaming
  links are ready.
- Shows use a matching "Shows coming soon" state when no future dates are in
  the data file.
- Live social links:
  - Instagram: `https://www.instagram.com/noahdesimoneandtherevival`
  - Facebook: `https://www.facebook.com/profile.php?id=61585849155897`

## Design Direction

- Preserve the current burnt umber palette: near-black background, warm cream
  text, muted tan secondary text, burnt red-orange accent, and amber highlight.
- Use the mic-stand stage background as the splash image, then feature the live
  band photo as a full-width performance strip after the hero.
- Use the phoenix/revival mark as a recurring accent, not the primary visual.
- Avoid generic AI-looking patterns: fake band imagery, abstract blob
  decoration, glossy gradients, and startup-style card stacks.
- Keep the hero performance-forward: large band name, short positioning line,
  social/show calls to action, and enough vertical space for the next section
  to feel connected.
- Use full-width sections. Reserve card styling for repeated show entries.
- Keep typography restrained outside the hero so the page feels like a real
  band site rather than a template.
- Use clear focus states, readable contrast, and meaningful `alt` text for
  content images. Decorative marks should use empty `alt=""`.

## Shows Data

Shows are maintained manually in `data/shows.json`:

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

Required fields:

- `date`
- `venue`
- `city`
- `state`

Optional fields:

- `time`
- `venueUrl`
- `ticketUrl`
- `notes`

The site filters out past dates, sorts future dates chronologically, and renders
ticket links as the primary action. If only `venueUrl` exists, it renders a
"Venue details" action.

## Technical Structure

Keep the site static and GitHub Pages-friendly:

```text
/
|-- index.html
|-- styles.css
|-- scripts.js
|-- data/
|   `-- shows.json
|-- assets/
|   |-- band-photo.jpeg
|   |-- revival-mark.png
|   |-- stage-background.jpg
|   `-- og-default.png
`-- .github/workflows/deploy.yml
```

Avoid a JavaScript framework until the site needs a CMS, embedded media widgets,
or heavier interactivity.

## QA Checklist

1. Test desktop, tablet, and phone widths.
2. Click Instagram, Facebook, venue, ticket, and future Spotify links.
3. Test `data/shows.json` with zero, one, and multiple future shows.
4. Confirm invalid or past shows do not display.
5. Confirm the empty music and shows states read as intentional coming-soon
   content.
6. Confirm all images load and decorative images do not create noisy alt text.
7. Check title, meta description, Open Graph title, and social preview image.
8. Confirm deployment still succeeds on GitHub Pages.
