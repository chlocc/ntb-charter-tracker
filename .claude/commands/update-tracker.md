---
description: Refresh the NTB charter tracker — research changes since the last update, update the data and the web page, and write a changelog entry.
---

You are updating the National Trust Bank (NTB) charter tracker. Follow `CLAUDE.md` for the
method, sourcing rules, and output format. Work in this order:

1. **Read the baseline.** Open `data/applicants.md` and note the "Last updated" date and the
   current roster/status of every applicant.

2. **Research what changed since that date.** Search the primary OCC sources first (news
   releases, the Digital Assets Licensing Applications index, Corporate Decision letters, the
   Corporate Applications Search), then reputable press and ICBA/BPI/NCRC comment letters.
   Specifically look for:
   - New NTB charter applications filed (any applicant not in the roster).
   - Decisions since the baseline: new conditional approvals, **final** approvals, denials,
     or withdrawals — especially for the currently-Pending applicants, and whether any
     Conditional applicant reached final approval or opened.
   - Status / condition changes, new comment-letter opposition, or requests for further info.
   - Whether any **APPROX.** receipt date (Fidelity, Crypto.com/Foris DAX, Bridge, Laser
     Digital) can now be pinned EXACT via the OCC CAS record or weekly bulletin.
   - Cross-cutting: Fed master-account policy, OCC rulemaking/litigation on NTB charters,
     GENIUS Act rulemaking milestones.

3. **Update the data.** Edit `data/applicants.md` to reflect every confirmed change. Keep the
   EXACT/APPROX. flags honest and cite the source for each change. Do NOT change the
   "Last updated" date here unless the user runs `/rebaseline` — leave the diff baseline
   intact so the digest stays meaningful (the changelog records the run date).

4. **Regenerate the page.** Edit `index.source.html` (the plaintext source) to match the new
   data. NEVER edit `index.html` directly — it is the encrypted build and is not human-readable.
   Preserve the existing visual system and structure — edit content, not styling. Every
   new/changed cell must carry a source hyperlink; keep APPROX. notes and conditions blocks.
   Then rebuild the encrypted page: run `NTB_PASSWORD='<gate password>' node encrypt.js`
   (the operator/scheduled task supplies the password via the env var; it is never stored in
   this repo). This regenerates `index.html` from `index.source.html`.

5. **Changelog.** Append a dated entry to `CHANGELOG.md` (create it if missing) summarizing
   what changed this run, each item with a source link — or "No material changes" if nothing
   moved.

6. **Report.** Give the user a short "What changed since [baseline date]" digest. If a git
   remote and GitHub Pages are configured, offer to commit and push to publish (do not push
   without confirmation unless the user has said to auto-publish).

Rigor reminder: this is legal research. Hyperlink every factual claim to a primary source
where possible, distinguish EXACT vs. APPROX., and flag anything you could not verify.
