# Phase 5: First Real Band Site

## Objective

Replace the under-construction page with a simple, polished one-page band website.

## Recommended Site Sections

1. Hero
2. Music
3. Shows
4. Bio
5. Contact

## Technical Structure

Keep the first full version static:

```text
/
|-- index.html
|-- styles.css
|-- assets/
|   |-- band-photo.jpg
|   |-- cover-art.jpg
|   `-- social-preview.jpg
`-- .github/workflows/deploy.yml
```

Avoid adding a JavaScript framework until the site needs dynamic features.

## Hero Section

Content:

- Band name
- Short positioning line
- Primary visual: band photo, show photo, or artwork
- Main action: listen, follow, or contact

Implementation notes:

- Use a real image asset instead of a generic graphic.
- Use descriptive `alt` text.
- Keep the band name visible in the first viewport.

## Music Section

Content:

- Spotify link
- Apple Music link
- Bandcamp link
- YouTube link
- Embedded player only if it does not slow the page down too much

Implementation notes:

- Use normal links first.
- Add embeds later if needed.
- Open external links in the same tab unless the band prefers otherwise.

## Shows Section

Start with manually edited HTML:

```html
<section id="shows" aria-labelledby="shows-title">
  <h2 id="shows-title">Shows</h2>
  <ul class="show-list">
    <li>
      <time datetime="2026-08-15">Aug 15, 2026</time>
      <span>Venue Name</span>
      <span>City, ST</span>
      <a href="https://example.com/tickets">Tickets</a>
    </li>
  </ul>
</section>
```

If shows change often, later options include:

- Pulling from Bandsintown
- Pulling from Songkick
- Maintaining a small JSON file
- Using a simple CMS

## Bio Section

Content:

- 1 short paragraph for fans
- 1 longer paragraph for press/booking
- Optional press quote

Implementation notes:

- Keep the first version concise.
- Avoid long blocks of text on mobile.

## Contact Section

Content:

- Booking email
- Press email if separate
- Social links
- Optional newsletter signup

Implementation notes:

- Use `mailto:` for email.
- If spam becomes a problem, replace direct email with a form service later.

## Metadata And Sharing

Add basic social metadata:

```html
<meta property="og:title" content="[Band Name]">
<meta property="og:description" content="Official website for [Band Name].">
<meta property="og:image" content="https://www.example.com/assets/social-preview.jpg">
<meta property="og:url" content="https://www.example.com">
<meta name="twitter:card" content="summary_large_image">
```

## QA Checklist

Before publishing the first real version:

1. Test desktop, tablet, and phone widths.
2. Click every link.
3. Confirm all images load.
4. Confirm image file sizes are reasonable.
5. Run Lighthouse or PageSpeed Insights.
6. Check the site title and meta description.
7. Confirm contact info is correct.
8. Confirm HTTPS works on the custom domain.

## Acceptance Checklist

- The site has real band content.
- The first viewport identifies the band clearly.
- Music links work.
- Shows are current or intentionally hidden.
- Contact info works.
- The deployment workflow still succeeds.
