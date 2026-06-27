# Phase 3: GitHub Actions CI/CD

## Objective

Deploy the static site to GitHub Pages whenever changes are pushed to `main`.

## GitHub Pages Settings

Codex should configure GitHub Pages through `gh api` first. Chrome is the fallback if GitHub rejects the API call or if the setting needs a browser-only confirmation.

After pushing the workflow file:

```sh
gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow
```

If Pages already exists, inspect the current setting:

```sh
gh api repos/OWNER/REPO/pages
```

If CLI/API setup is blocked, open the GitHub repository in Chrome and set `Settings > Pages > Build and deployment > Source` to `GitHub Actions`.

## Create `.github/workflows/deploy.yml`

```yaml
name: Deploy static site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Prepare static files
        run: |
          mkdir -p _site
          cp index.html styles.css _site/
          if [ -d assets ]; then cp -R assets _site/assets; fi
          touch _site/.nojekyll

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: _site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    permissions:
      pages: write
      id-token: write

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Why The Workflow Builds `_site`

The repository will eventually contain docs, config, and other files that should not be published as website content. This workflow copies only the public site files into `_site`, then deploys that folder.

Add new public assets under `assets/` and they will be copied automatically.

## First Deployment

Run:

```sh
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push
```

Then in GitHub:

```sh
gh run list --workflow "Deploy static site to Pages" --limit 5
gh run watch
```

If a run fails, inspect it:

```sh
gh run view --log-failed
```

Open Chrome only if the run details or Pages settings need browser inspection.

## Troubleshooting

### The deploy job says Pages is not enabled

Go to `Settings > Pages` and set the source to `GitHub Actions`.

### The workflow cannot deploy

Confirm the deploy job has:

```yaml
permissions:
  pages: write
  id-token: write
```

### The site deploys but CSS is missing

Confirm `styles.css` exists at the repo root and the workflow copies it:

```sh
cp index.html styles.css _site/
```

### The site deploys old content

1. Confirm the latest commit is on `main`.
2. Check the latest workflow run.
3. Confirm the deployment job succeeded.
4. Hard refresh the browser.

## Acceptance Checklist

- GitHub Actions runs on pushes to `main`.
- The workflow completes successfully.
- GitHub Pages shows the deployed placeholder site.
- The deployment URL appears in the workflow summary.

## Codex Can Execute

- Add the workflow file.
- Commit and push the workflow.
- Enable Pages with GitHub Actions as the source through `gh api`.
- Watch the workflow result through `gh run`.
- Use Chrome for GitHub UI checks only when the CLI/API path is insufficient.

## References

- GitHub Docs: [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- GitHub Docs: [Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
