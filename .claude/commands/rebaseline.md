---
description: Reset the diff baseline — verify the full current roster and set data/applicants.md "Last updated" to today.
---

Re-baseline the NTB charter tracker so future `/update-tracker` runs diff against a fresh
starting point. Do this after a large refresh or periodically (e.g. monthly).

1. Do a **full sweep** of the current state of every applicant in `data/applicants.md`
   against the primary OCC sources (per `CLAUDE.md`) — confirm each status, decision date,
   and any conditions are still accurate, and add any applicants that appeared.
2. Correct `data/applicants.md` to the verified current state.
3. Set the **"Last updated"** date at the top of `data/applicants.md` to today's date.
4. Regenerate `index.html` and append a `CHANGELOG.md` entry noting the re-baseline.
5. Report a summary of anything that was corrected during the sweep.

Keep the sourcing rules from `CLAUDE.md`: hyperlink every claim, honest EXACT/APPROX. flags,
flag unverifiable items.
