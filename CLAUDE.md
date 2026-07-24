# National Trust Bank (NTB) Charter Tracker — Project Guide

This project maintains a public survey of the **current state of play of U.S. national
trust bank (NTB) charter applications before the OCC** (Office of the Comptroller of the
Currency). The deliverable is a single self-contained web page (`index.html`) that is
published to GitHub Pages and refreshed on a recurring basis.

Claude Code should treat this file as the standing brief for the project. When asked to
update the tracker, follow the method and rules below exactly.

## What we track

Focus **only on national TRUST bank charters** before the OCC. For each applicant capture:

1. **Company / legal entity name** (exact).
2. **Charter subtype** — de novo national trust bank vs. **conversion** from a state trust
   company (name the state regulator, e.g. NYDFS, SD).
3. **Proposed activities** — 2–5 specific points drawn from the OCC decision letter or the
   application filing. Quote the source's language where possible.
4. **OCC receipt date** — flagged **EXACT** or **APPROX.** (see rules).
5. **Key dates & OCC decision** — filing → conditional approval (with Corporate Decision
   number) → final approval / denial / withdrawal.
6. **Status** — Final / Conditional / Pending / Denied.
7. **Conditions, roadblocks & opposition** — the material conditions from the decision
   letter (capital minimums, liquid-asset floors, 180-day expense reserve, BSA/AML,
   GENIUS-Act conformance, expiry clocks) and any ICBA/BPI/NCRC comment-letter opposition.

De novo full-service banks and industrial banks (ILCs) are **NOT** trust charters — keep
them in a separate "Related context" section (e.g. Nubank, Revolut, Mercury = full banks;
Klarna = Utah ILC). Do not mix them into the NTB tables.

The current roster and last-known status live in **`data/applicants.md`** — that is the
baseline to diff against on every update.

## Sourcing rules (non-negotiable — this is legal research)

- **Every** date, status, activity point, and condition must be hyperlinked to its source.
- **Primary OCC sources first**, then reputable press:
  - OCC news releases: https://www.occ.gov/news-issuances/news-releases/2026/
  - OCC Digital Assets Licensing Applications index (has "Date Received"):
    https://www.occ.gov/topics/charters-and-licensing/digital-assets-licensing-applications/index-digital-assets-licensing-applications.html
  - OCC Corporate Decision letters:
    https://www.occ.gov/topics/charters-and-licensing/interpretations-and-decisions/2026/
  - OCC Corporate Applications Search (CAS/CATS): https://apps.occ.gov/CAAS_CATS/
  - Press: American Banker, Banking Dive, CoinDesk, Reuters, Law360, PYMNTS, Ledger Insights.
  - Opposition letters: ICBA (icba.org), Bank Policy Institute (bpi.com), NCRC (ncrc.org).
- **EXACT vs. APPROX. receipt dates.** OCC decision letters state the *decision* date and
  control number but usually **not** the *receipt* date. A date is EXACT only if it comes
  from (a) the OCC "Date Received" index, (b) the application document's own date, or (c) a
  decision letter reciting "On [date], [X] filed." Otherwise mark **APPROX.** and add a
  one-line note on why it can't be pinned (e.g. inferred from control-number year + press
  announcement). To upgrade an APPROX. date, pull the applicant's OCC CAS record by filing
  ID or the OCC weekly bulletin "applications received" listing.
- **Never assert what the source doesn't support.** If a characterization comes from a
  company press release or context rather than the OCC letter, say so explicitly (see the
  Circle row, where "bankruptcy-remote / HQLA / ministerial" is flagged as Circle's framing,
  not OCC-letter language).
- Flag anything you could not verify from a primary source.

## Output format

`index.html` is a **single self-contained file** — all CSS inline, no external assets, no
build step. Dark theme. Structure:

- Header + legend + summary stat tiles.
- An explainer box on why some receipt dates are APPROX.
- **Table 1 — Approved & Conditionally Approved** (each row: entity, subtype, activities,
  receipt date, key dates/decision, status badge, conditions/opposition block).
- **Table 2 — Pending Review.**
- **Table 3 — Denied.**
- **Context section** — de novo / full-service / ILC applicants (clearly labeled NOT trust).
- Footer with method, confidence flags, and status conventions.

Keep the existing visual system (status colors: green=final, blue=conditional,
amber=pending, red=denied, purple=context; `APPROX.` amber chips). When you regenerate,
preserve the look — edit content, don't restyle.

## How to update

Run `/update-tracker` (see `.claude/commands/update-tracker.md`). In short: read
`data/applicants.md`, search the sources for anything new since the "Last updated" date,
update both `data/applicants.md` and `index.html`, append a dated entry to `CHANGELOG.md`,
and produce a short "what changed" digest. To reset the diff baseline after a big refresh,
run `/rebaseline`.

## Publishing

`index.html` publishes to GitHub Pages. If a GitHub Action is configured
(`.github/workflows/`), pushing to `main` redeploys automatically. See `README.md`.
