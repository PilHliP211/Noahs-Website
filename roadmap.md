# Band Website Roadmap

## Goal

Create a simple GitHub repository with CI/CD that deploys an under-construction website to the band's custom domain.

Execution guide: [Codex-Assisted Execution](docs/roadmap/07-codex-assisted-execution.md)

## Phase 1: Repo Setup

Technical guide: [Phase 1: Repository Setup](docs/roadmap/01-repo-setup.md)

1. Create a GitHub repository for the band website.
2. Add the initial static site files:
   - `index.html`
   - `styles.css`
   - `.nojekyll`
   - `README.md`
3. Keep the first version intentionally simple: one under-construction page with the band name, a short message, and optional links for social/music/contact.

## Phase 2: Temporary Site

Technical guide: [Phase 2: Under-Construction Site](docs/roadmap/02-under-construction-site.md)

Build a single-page under-construction site with:

- Band name
- "Site coming soon" message
- Optional launch note
- Optional links:
  - Instagram
  - Spotify
  - Bandcamp
  - Booking/contact email

## Phase 3: CI/CD With GitHub Actions

Technical guide: [Phase 3: GitHub Actions CI/CD](docs/roadmap/03-github-actions-cicd.md)

1. Add `.github/workflows/deploy.yml`.
2. Configure the workflow to run on pushes to `main`.
3. Use GitHub Pages Actions:
   - `actions/configure-pages`
   - `actions/upload-pages-artifact`
   - `actions/deploy-pages`
4. In the GitHub repo settings, enable Pages and set the source to GitHub Actions.
5. Confirm the site deploys successfully to the temporary GitHub Pages URL.

## Phase 4: Custom Domain Setup

Technical guide: [Phase 4: Custom Domain And DNS](docs/roadmap/04-custom-domain-and-dns.md)

1. Choose the canonical domain:
   - Recommended: `www.example.com`
   - Optional redirect from `example.com`
2. Add the custom domain in GitHub Pages settings.
3. Configure DNS at the domain registrar:
   - `www` subdomain: add a `CNAME` record pointing to `<github-username>.github.io`
   - Apex/root domain: add GitHub Pages `A` records, or use `ALIAS`/`ANAME` if supported by the DNS provider
4. Wait for DNS propagation.
5. Enable "Enforce HTTPS" in GitHub Pages settings once available.
6. Verify both the apex domain and `www` version resolve correctly.

## Phase 5: Next Version

Technical guide: [Phase 5: First Real Band Site](docs/roadmap/05-next-version.md)

Once the placeholder page is live, expand the site into a real one-page band website:

- Hero section with band photo or artwork
- Music links
- Upcoming shows
- Short bio
- Contact/booking info
- Newsletter or announcement signup if needed

## Open Details Needed

Tracking document: [Required Information](docs/roadmap/06-required-information.md)

- Band name
- Domain name
- GitHub account or organization name
- Desired repo name
- Social/music/contact links
- Whether the site should use plain HTML/CSS or a lightweight framework later
