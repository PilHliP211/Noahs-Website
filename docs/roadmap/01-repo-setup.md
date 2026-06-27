# Phase 1: Repository Setup

## Objective

Create the initial GitHub repository and local file structure for a simple static band website.

## Decisions To Make First

1. Choose the GitHub owner:
   - Personal account, for example `noah`
   - Organization account, for example `band-name`
2. Choose the repository name:
   - Recommended: `band-name-website`
   - Also fine: `website`
3. Choose the default branch:
   - Recommended: `main`

## Local Setup Steps

Run these commands from the project folder:

```sh
git init
git branch -M main
mkdir -p .github/workflows
touch index.html
touch styles.css
touch .nojekyll
touch README.md
```

## Initial File Purposes

| File | Purpose |
| --- | --- |
| `index.html` | The site's only page for the first release. |
| `styles.css` | Visual styling for the placeholder page. |
| `.nojekyll` | Tells GitHub Pages not to process the site with Jekyll if branch publishing is ever used. |
| `README.md` | Explains the repo, deployment path, and local workflow. |
| `.github/workflows/deploy.yml` | Deploys the site to GitHub Pages after each push to `main`. |

## Recommended README Contents

````md
# Band Website

Static website for the band.

## Current Status

The site currently serves an under-construction page.

## Deployment

Pushing to `main` deploys the site to GitHub Pages through GitHub Actions.

## Local Preview

Open `index.html` in a browser, or run a tiny local server:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.
````

## Create The GitHub Repository

Codex should create the repository through the `gh` CLI when possible. Chrome is only needed if GitHub asks for an account flow or setting that is not available through the CLI.

First verify authentication:

```sh
gh auth status
```

Then create the repo, attach it as `origin`, and push:

```sh
gh repo create OWNER/REPO --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if the repository should not be public.

## Connect Local Repo To GitHub

Replace `OWNER` and `REPO` with the actual GitHub owner and repository name:

```sh
git remote add origin https://github.com/OWNER/REPO.git
git add .
git commit -m "Create placeholder band website"
git push -u origin main
```

If the repository was created with `gh repo create --source=. --remote=origin --push`, the remote and first push may already be handled.

## Acceptance Checklist

- `git status` is clean after the first commit.
- GitHub shows the repo and files.
- The default branch is `main`.
- The repository has `.github/workflows/` ready for CI/CD.

## Codex Can Execute

- Create the local files.
- Initialize Git.
- Create the GitHub repo with `gh repo create`.
- Push the first commit when a remote is available.
