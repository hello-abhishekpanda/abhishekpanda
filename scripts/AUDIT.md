# Website audit

Install with `pnpm install` and `pnpm exec playwright install chromium`.
Start the target with `pnpm dev --hostname 127.0.0.1 --port 3210`.
Run `pnpm audit:serve`, then use the footer's **Website quality audit** link.
The loopback dashboard starts a single full scan at a time and offers PDF, HTML and JSON downloads.

CLI: `pnpm audit:site`. Set `AUDIT_BASE_URL` to select your authorized target.
Use `pnpm audit:site --quick --no-external` for one light/desktop profile and no external requests.
Full mode runs Chromium at 320, 390, 768, 1440 and 1920px in both themes.
Reports have unique timestamped directories under `output/audits`, with screenshots and a full ledger.
Exit codes: 0 no failed checks, 1 failed checks, 2 runner/report failure. Warnings still require review.

Coverage: root portfolio routes, all HTML files in public/learning, shadow-root links/images,
image decode/hidden inventory, console exceptions, network failures, overflow, semantics,
axe WCAG A/AA checks, all 52 .NET diagram selections, stepping, search and saved progress,
discovered links, metadata endpoints and all static image/PDF assets.
External URLs are deduplicated, checked with six workers, a timeout and one retry for server errors.
Blocked requests are warnings, never silently counted as success.

Limits: Chromium is not all browsers. Image decode does not prove design quality or brand authenticity.
No tool can guarantee all behavior, screen resolutions, security, content correctness or accessibility.
No forms are submitted and no third-party accounts are accessed. Inspect screenshots and warnings.
The dashboard binds only to 127.0.0.1; it checks Host, Origin and an unpredictable run token.
Do not expose it as a public production service. Reports may contain page URLs and text.
