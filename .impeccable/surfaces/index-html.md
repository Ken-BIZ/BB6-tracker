---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# BB6 課程製作 — app shell + 專案概況

Scope: whole app (index.html, five pages) re-skinned into a sidebar shell; 專案概況 is the landing surface and gets the full treatment. Visitor mode: Operate. Users: Daniel, Ken, Ellen; weekly meeting on a projector plus desk reporting. Task: tell at a glance whether the KR will be met and who/what is the bottleneck; reach the team's weekly tools.

Confirmed answers (2026-11-23): external tools (影片清單, 每週部門統計值填報, 教材總表) open in a new tab; old statistics sheet left out; #FFEA41 yellow stays the main colour (tiles in the yellow family, not the reference's amber/orange); greeting banner without illustration, carrying the KR verdict; light mode toggle, dark by default. Data, calculations and copy fixed in the previous rounds stay as they are.

## Direction contract

THESIS: The company's internal-tool shell (sidebar + rounded content panel + greeting banner + big colour tiles), so BB6 sits beside the sibling department tool; refuses the old top-tab bar with a yellow rule and flat cards.
OWN-WORLD: Charcoal ground #111214, content panel #1b1c1f with 24px radius, tiles in a yellow family (#FFEA41 → deeper golds) with black ink and one soft circle each; sidebar items as 12px-radius pills, active = yellow-tinted pill with yellow icon; line icons, 1.75 stroke; system sans with heavy numerals. Light theme mirrors it on #f3f2ee / #ffffff.
STORY: Open → greeting names you and your pending load → verdict reads from the back of the room → tiles give the four KR numbers → burn-up, contribution, bottlenecks below → sidebar reaches the other pages and the three weekly tools.
FIRST VIEWPORT: 1440×900. Sidebar 248px left: logo + "BB6 課程製作", group BB6 (5 pages), group 每週工具 (3 external, arrow icon), bottom: member, 淺色模式, 收合側邊欄. Panel: top-right 資料截至 + 完工預測設定; greeting banner full width (午安，Ken + personal pending line; verdict 36px state colour + sub + spike warning); section label with hairline (KR title); four 200px yellow tiles. Primary action: none to press; the verdict is the answer, settings gear is secondary.
FORM: pinned — seed: none (pinned) "我想往這種介面風格方向大改我的網頁設計" (with the sibling tool screenshot) + "維持亮黃為主". Signature interaction: sidebar collapse to icon rail (remembered); theme toggle without reload, charts re-coloured. Motion: 180ms state transitions only.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
