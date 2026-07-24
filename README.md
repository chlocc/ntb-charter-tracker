# NTB Charter Tracker

A public survey of the current state of play of **U.S. national trust bank (NTB) charter
applications** before the OCC — approved, conditional, pending, and denied — with proposed
activities, timelines, OCC receipt dates, conditions, and comment-letter opposition, each
cited to its source. The deliverable is a single self-contained page, `index.html`,
published to GitHub Pages.

This repo is set up to be maintained with **Claude Code**.

## Contents

```
.
├── CLAUDE.md                     # Project brief: method, sourcing rules, output format (auto-loaded by Claude Code)
├── index.html                    # The tracker (self-contained; open in any browser)
├── data/
│   └── applicants.md             # Source-of-truth roster the tracker diffs against
├── .claude/commands/
│   ├── update-tracker.md         # /update-tracker — weekly refresh
│   └── rebaseline.md             # /rebaseline — reset the diff baseline
├── .github/workflows/
│   └── deploy-pages.yml          # Auto-publish index.html to GitHub Pages on push to main
└── CHANGELOG.md                  # Dated record of updates (created on first update)
```

## Prerequisites

- [Claude Code](https://docs.claude.com/en/docs/claude-code) installed and authenticated.
- Git, and a GitHub account (for publishing).

## Everyday use

From the project folder:

```bash
claude          # start Claude Code; CLAUDE.md loads automatically
```

Then, to refresh the tracker:

```
/update-tracker
```

Claude will research what's changed since the last update, edit `data/applicants.md` and
`index.html`, append to `CHANGELOG.md`, and give you a short "what changed" digest. Roughly
monthly (or after a big refresh) run `/rebaseline` to reset the diff starting point.

Headless (e.g. from a script or cron on your machine):

```bash
claude -p "/update-tracker" --permission-mode acceptEdits
```

## Publishing to GitHub Pages

1. Create a GitHub repo and push this folder to `main`.
2. In the repo: **Settings → Pages → Source: GitHub Actions** (or "Deploy from a branch" →
   `main` / root if you prefer no Action).
3. The included workflow `.github/workflows/deploy-pages.yml` publishes `index.html` on every
   push to `main`. Your site will be at `https://<user>.github.io/<repo>/`.

## Automating weekly updates (optional)

Two ways to keep the live page current without manual steps:

- **Local cron** (simplest): schedule `claude -p "/update-tracker" --permission-mode acceptEdits`
  then `git add -A && git commit -m "weekly update" && git push`. Runs only when your machine
  is on.
- **GitHub Actions with Claude Code**: run Claude Code headless in CI on a schedule. This
  requires adding an `ANTHROPIC_API_KEY` repo secret and a scheduled workflow that runs the
  update and commits. A template is noted in `.github/workflows/` — enable it only after you
  add the secret. (Cloud CI billing/API usage applies.)

## Sourcing discipline

This is legal research. Every date/status/activity/condition is hyperlinked to a source;
OCC primary sources take priority; receipt dates are flagged **EXACT** vs **APPROX.**; and
nothing is asserted beyond what the source supports. See `CLAUDE.md` for the full rules.
