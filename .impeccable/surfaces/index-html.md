---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# BB6 課程製作 — app shell + 專案概況

Scope: whole app (index.html, five pages); 專案概況 is the landing surface and gets the full treatment, other pages inherit palette, type and density. Visitor mode: Operate. Users: Daniel, Ken, Ellen; weekly meeting on a projector plus desk reporting. Task: tell at a glance whether the KR will be met and which module/person is stuck; reach the weekly tools.

History: the first shell (2026-11-23) copied a sibling department tool too closely; the user asked for the team's own style. Direction round 2026-11-23: user chose the 出發看板 card (catalog challenger vernacular-ephemera-boarding-pass-and-gate-board) from a hand of 公文核章 (assigned), 印務樣張 (pick), 出發看板, canon. Standing answers: external tools open in a new tab; #FFEA41 stays the brand yellow; light-mode toggle, dark default; data, calculations and copy stay.

## Direction contract

THESIS: Modules are departures on a gate board, ranked by forecast completion, Gate 1–5 the boarding sequence; a change does not vanish, its row stays lit until someone has seen it. Refuses the copied shell's yellow colour-tile fills, decorative circles and illustrated-greeting banner.
OWN-WORLD: Board ink #0B0D10 ground, slate #16181D rail and rows, steel #6B7178 labels, flap-white #F2F2EE text, brand yellow #FFEA41 for flap characters and "now", alert orange #FF5A36 only for changes/late: a late row shows alert ink on its 預計完工 flap tiles and status; a changed row (有變動) gets a tinted, fully ringed row until clicked. Member chips on the board are neutral; Ellen's orange stays a member identity elsewhere. Condensed mono (Martian Mono, narrow) for codes, dates, numbers in flap cells; Noto Sans TC for Chinese. Shape language kept from the previous version at the user's request (2026-11-23): inset rounded panel 24px, rounded cards 16–20px, four stat cards; hairline row rules inside cards; segmented pass with perforation. Feedback: CSS Grid layouts; hover lifts (transform translateY, shadow), opacity fades and 160–200ms transitions on rows, cards and nav. Light theme = daytime board: #F2F3F1 ground, #FFFFFF rows, ink characters.
STORY: Read the verdict and the big completion figure → scan the board for late or changed rows → see who holds the most pending sections on the passes → drill into burn-up and trends below.
FIRST VIEWPORT: 1440×900, matching the chosen sketch: 220px rail (yellow brand, nav, 每週工具), inset rounded panel; main: verdict (38px) + sub line left, big mono 36.1% right; a strip of four flap stats; the departure board (模組 flap / 名稱 / 預計完工 flap / 目前 Gate segments / 待處理 / 狀態) with late rows' dates in alert ink and changed rows ringed; the scenario note sits under the board rows.
FORM: catalog challenger vernacular-ephemera-boarding-pass-and-gate-board, list position: challenger (my list ranked it after 印務樣張 and 台鐵時刻看板); seed:ec7785af60ab794b. Signature interaction: rows whose gate or status changed since this browser last looked stay lit with 「有變動」 until clicked; flap characters flip (two-frame) when a value changes, off under reduced motion.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
