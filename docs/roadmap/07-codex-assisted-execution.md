# Codex-Assisted Execution

## Objective

Identify which setup steps Codex can perform directly and which steps still need human input or approval. GitHub work should use the `gh` CLI first; Chrome is the fallback for GitHub screens or domain-provider settings that are not practical through the CLI.

## What Codex Can Do

With access to the local workspace, Git, `gh`, and Chrome, Codex can handle most implementation and setup tasks:

- Create and edit site files.
- Create the GitHub Actions workflow.
- Initialize Git and prepare commits.
- Verify GitHub CLI authentication with `gh auth status`.
- Create the GitHub repository with `gh repo create`.
- Push the first commit with Git.
- Enable and inspect GitHub Pages with `gh api` when permissions allow it.
- Watch workflow runs with `gh run`.
- Use GitHub in Chrome only for GitHub steps that are not accessible or reliable through the CLI.
- Add the custom domain in GitHub Pages settings with `gh api` when possible.
- Open the DNS provider in Chrome and add records, if the account is already signed in.
- Verify DNS with command-line checks.
- Verify the deployed site in a browser.

## What The User Still Needs To Provide

Codex cannot safely invent or bypass these details:

- Band name
- Domain name
- GitHub owner or organization
- Desired repository name
- DNS provider or registrar
- Social/music/contact links
- Any required 2FA codes
- Any account sign-in that is not already active in Chrome
- Any payment, billing, or domain-purchase approval

## GitHub CLI Workflow

Codex should start GitHub work with:

```sh
gh auth status
```

Create the repository and push the local site:

```sh
gh repo create OWNER/REPO --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if the repository should not be public.

Enable GitHub Pages with GitHub Actions as the build type:

```sh
gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow
```

Inspect the Pages configuration:

```sh
gh api repos/OWNER/REPO/pages
```

Watch deployments:

```sh
gh run list --workflow "Deploy static site to Pages" --limit 5
gh run watch
```

If a GitHub API command returns a permissions, validation, or already-exists error, Codex should inspect the response and either adjust the CLI/API call or switch to Chrome for that specific setting.

## Browser Workflow

When a browser step is needed:

1. Codex opens the relevant site in Chrome.
2. Codex uses the existing logged-in session when available.
3. If sign-in or 2FA is required, Codex pauses and asks the user to complete that step.
4. Codex continues once the user confirms the browser is ready.

## Recommended Execution Order

1. Fill in `docs/roadmap/06-required-information.md`.
2. Create the site files locally.
3. Create the GitHub repository.
4. Push the initial commit.
5. Enable GitHub Pages with GitHub Actions.
6. Confirm the temporary GitHub Pages URL works.
7. Add the custom domain in GitHub Pages.
8. Add DNS records at the registrar.
9. Wait for DNS propagation.
10. Enable HTTPS enforcement.
11. Verify the final domain in Chrome.

## Human Approval Points

Pause for user confirmation before:

- Creating a public GitHub repository.
- Publishing the first version of the site.
- Making DNS changes.
- Changing canonical domain settings.
- Enabling redirects that affect the live domain.

## Current Launch Inputs

Before Codex can perform the launch setup steps, fill these in:

| Item | Value |
| --- | --- |
| GitHub owner | TBD |
| Repository name | TBD |
| Domain name | TBD |
| DNS provider | TBD |
| Canonical domain | TBD |
| Band name | TBD |
