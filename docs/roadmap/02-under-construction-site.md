# Phase 2: Under-Construction Site

## Objective

Create a single static page that clearly says the band's website is coming soon.

## Suggested Content

Collect these details before finalizing the page:

- Band name
- Short message, for example `New site coming soon`
- Contact email
- Instagram URL
- Spotify URL
- Bandcamp URL

The page should still work if some links are missing.

## `index.html`

Use this as the initial placeholder. Replace bracketed values with real content.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta
      name="description"
      content="[Band Name] official website. New site coming soon."
    >
    <title>[Band Name]</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main class="page-shell">
      <section class="intro" aria-labelledby="site-title">
        <p class="eyebrow">Official website</p>
        <h1 id="site-title">[Band Name]</h1>
        <p class="message">New site coming soon.</p>

        <nav class="links" aria-label="Band links">
          <a href="mailto:booking@example.com">Booking</a>
          <a href="https://instagram.com/example">Instagram</a>
          <a href="https://open.spotify.com/artist/example">Spotify</a>
          <a href="https://example.bandcamp.com">Bandcamp</a>
        </nav>
      </section>
    </main>
  </body>
</html>
```

Remove any link that is not ready yet.

## `styles.css`

```css
:root {
  color-scheme: dark;
  --background: #101114;
  --foreground: #f4efe8;
  --muted: #bab1a5;
  --accent: #d94f30;
  --accent-soft: #f1c56b;
}

* {
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--foreground);
  background:
    linear-gradient(rgba(16, 17, 20, 0.75), rgba(16, 17, 20, 0.92)),
    radial-gradient(circle at 20% 10%, rgba(217, 79, 48, 0.4), transparent 32rem),
    #101114;
}

.page-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.intro {
  width: min(100%, 46rem);
}

.eyebrow {
  margin: 0 0 1rem;
  color: var(--accent-soft);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(3rem, 12vw, 8rem);
  line-height: 0.95;
}

.message {
  max-width: 36rem;
  margin: 1.25rem 0 0;
  color: var(--muted);
  font-size: clamp(1.15rem, 3vw, 1.6rem);
  line-height: 1.5;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 1rem;
  color: var(--foreground);
  text-decoration: none;
  border: 1px solid rgba(244, 239, 232, 0.28);
  border-radius: 999px;
}

.links a:hover,
.links a:focus-visible {
  border-color: var(--accent);
  outline: none;
}
```

## Local Preview

Open the file directly in a browser, or run:

```sh
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Validation Steps

1. Confirm the page has the correct band name.
2. Click every link.
3. Resize the browser to mobile width.
4. Confirm text does not overlap or overflow.
5. Run a basic HTML check:

```sh
npx html-validate index.html
```

If `npx` is not available, skip that command for now and rely on browser testing.

## Acceptance Checklist

- `index.html` loads in a browser.
- The page communicates that the site is coming soon.
- Links either work or have been removed.
- Mobile layout looks clean.

