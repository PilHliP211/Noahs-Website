# Phase 4: Custom Domain And DNS

## Objective

Connect the purchased domain to the GitHub Pages deployment and enable HTTPS.

## Choose The Canonical Domain

Recommended setup:

- Primary domain: `www.example.com`
- Redirect/helper domain: `example.com`

Using `www` as the primary host is usually easier because it can be configured with a `CNAME` record.

## Add The Domain In GitHub

Codex should add the custom domain with `gh api` first. The user should confirm the canonical domain before Codex saves this setting.

```sh
gh api -X PUT repos/OWNER/REPO/pages -f cname=www.example.com
```

If the command fails or GitHub requires browser confirmation:

1. Open the GitHub repository.
2. Go to `Settings`.
3. Go to `Pages`.
4. Under `Custom domain`, enter the chosen domain, for example `www.example.com`.
5. Click `Save`.

GitHub may create or update a `CNAME` file in the repository. Keep that file committed if it appears.

## DNS Records For `www`

Codex can add these DNS records in Chrome if the registrar or DNS provider account is already signed in. If the provider requires sign-in, 2FA, or billing confirmation, the user needs to complete that step.

At the domain registrar or DNS provider, create this record:

| Type | Name | Value |
| --- | --- | --- |
| `CNAME` | `www` | `OWNER.github.io` |

Replace `OWNER` with the GitHub user or organization that owns the repo.

Example:

```text
www CNAME noahs-band.github.io
```

## DNS Records For Apex/Root Domain

For the root domain, for example `example.com`, use GitHub Pages `A` records:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |

If the DNS provider supports `ALIAS`, `ANAME`, or flattened `CNAME` records at the apex, that can also point to `OWNER.github.io`.

## Optional IPv6 Records

If the DNS provider supports IPv6, add GitHub Pages `AAAA` records:

| Type | Name | Value |
| --- | --- | --- |
| `AAAA` | `@` | `2606:50c0:8000::153` |
| `AAAA` | `@` | `2606:50c0:8001::153` |
| `AAAA` | `@` | `2606:50c0:8002::153` |
| `AAAA` | `@` | `2606:50c0:8003::153` |

## Verify DNS

Run these checks after saving DNS records:

```sh
dig www.example.com CNAME +short
dig example.com A +short
dig example.com AAAA +short
```

Expected results:

- `www.example.com` should point to `OWNER.github.io`.
- `example.com` should return the GitHub Pages IP addresses.
- DNS propagation can take time, often minutes but sometimes much longer.

## Enable HTTPS

After GitHub verifies the domain:

```sh
gh api -X PUT repos/OWNER/REPO/pages -F https_enforced=true
```

If the API reports that HTTPS is not ready yet:

1. Open `Settings > Pages`.
2. Wait until the HTTPS certificate is available.
3. Enable `Enforce HTTPS`.

## Final Browser Checks

Visit:

```text
https://www.example.com
https://example.com
```

Confirm:

- The placeholder page loads.
- The browser shows HTTPS.
- The non-canonical domain redirects or resolves as expected.

## Acceptance Checklist

- GitHub Pages accepts the custom domain.
- DNS records point to GitHub Pages.
- HTTPS is enforced.
- Both apex and `www` domains work.
- The canonical domain is documented in the repo README.

## Codex Can Execute

- Add the custom domain in GitHub Pages settings.
- Add the custom domain with `gh api` when possible.
- Add DNS records at the provider when authenticated.
- Run `dig` checks locally.
- Recheck GitHub Pages certificate status.
- Enable HTTPS after the certificate is ready.

## References

- GitHub Docs: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- GitHub Docs: [About custom domains and GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
