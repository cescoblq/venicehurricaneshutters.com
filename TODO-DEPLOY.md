# TODO before venicehurricaneshutters.com goes live

Site builds clean (`hugo --minify`, 9 pages, 0 errors — only harmless Hugo deprecation
warnings about `languageCode`/`.Site.Data`). Hugo Modules (bulma dependency of the
hugo-fresh theme) had to be wired manually — pinned to
`github.com/jgthms/bulma@v0.0.0-20220508134905-3e00a8e6d0d0` in `hugo.toml`/`go.mod`
because the latest pseudo-version ships `bulma.scss` instead of `.sass` and breaks the
theme's `@import "bulma/bulma"`. If `hugo mod tidy` is ever re-run, re-check this pin.

Everything below is what's still missing before this can actually receive and pay for traffic.

## 1. Turnstile widget (anti-bot)
- Create the Turnstile widget for `venicehurricaneshutters.com` at dash.cloudflare.com → Turnstile.
- Replace `TURNSTILE_SITEKEY_TODO` in `layouts/partials/lead-form.html` (`data-sitekey` attribute) with the real site key.
- Deploy the managed siteverify Cloudflare Worker (same pattern as the Örebro/Burgos sites — see the `turnstile-spin` skill) and replace `TURNSTILE_WORKER_URL_TODO` in the same file's `<script>` block with the deployed Worker URL.

## 2. TrustedForm (ActiveProspect) — TCPA consent certificate
- **The ActiveProspect account does not exist yet.** François needs to sign up at activeprospect.com.
- Once created, paste the standard adapter snippet where marked in `layouts/partials/lead-form.html` (clearly commented, above the form). It auto-populates the hidden `xxTrustedFormCertUrl` field already present in the form.
- Until this is done, that hidden field will always submit empty — most lead buyers (78% per `recherche/53-carto-debouches-usa.md` §4) require this certificate before accepting/paying for a lead, so **this blocks monetization**, not just the pilot build.
- Budget ~$0.30-0.55/lead once active (see same source).

## 3. n8n webhook
- Webhook `niches-leads-hurricane-shutters-us` does **not exist yet** in n8n (byteblast VPS). Create it, matching the field names sent by `functions/api/submit.js` → the lead form.
- Route to the same Google Sheet pattern used by other niches (1 tab per niche) or a new tab — François's call.

## 4. DNS + hosting
- Domain `venicehurricaneshutters.com` still needs to be pointed to Cloudflare (nameserver change at the registrar, then zone setup — same API procedure as documented in `project-cloudflare-automatisation-dns.md`).
- Create the Cloudflare Pages project, connect it to this site's git repo (not yet created — see §6), set build command `hugo --minify` and pin Hugo v0.164.0 extended (or newer) via `HUGO_VERSION` env var. **Also requires enabling Hugo Modules on Pages** (Go toolchain available in the build image — verify, since this site needs `go` at build time unlike the other US sites).

## 5. Debouché / lead buyer confirmation — NOT YET DONE
Per `recherche/53-carto-debouches-usa.md`: no acheteur a confirmé publiquement la couverture hurricane shutters en Floride. Priority contacts (not yet made):
1. Inquirly (inquirly.com/affiliates)
2. 33 Mile Radius (1-888-594-8381)
3. Fallback: direct sale to already-ranked local PMEs if no marketplace confirms coverage.

## 6. Git repo
- No GitHub repo created for this site yet. `git init` was run locally (1 commit) but no remote exists — create `cescoblq/venicehurricaneshutters-com` (or similar) when ready to deploy.

## 7. Photography
- `static/images/lead/placeholder-hurricane-shutters.svg` is a text-labeled placeholder graphic, not a real project photo — swap for a real (licensed/stock) hurricane shutters installation photo before launch.

## 8. Content review
- All regulatory/program claims (Wind-Borne Debris Region, My Safe Florida Home eligibility, insurance credit percentages) are sourced in `data/citypack.json` but were written in July 2026 — MSFH funding/eligibility rules change between cycles, so **re-verify current MSFH status before launch** if more than a few weeks pass before going live.
