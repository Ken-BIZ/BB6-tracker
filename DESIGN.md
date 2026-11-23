---
name: BB6 課程製作
description: Internal course-production tracker read as an airport departure board, split-flap yellow on board ink, inside a rounded sidebar-and-panel shell.
colors:
  signal-yellow: "#FFEA41"
  accent-ink-light: "#6E5A00"
  chart-accent-light: "#A68600"
  alert-orange: "#FF5A36"
  alert-orange-light: "#D93A16"
  state-good: "#4ade80"
  state-warn: "#FF8A4C"
  state-good-light: "#15803d"
  state-warn-light: "#C2410C"
  board-ink: "#0B0D10"
  slate-panel: "#121419"
  card-slate: "#191C22"
  raised-slate: "#1C2127"
  pass-slate: "#20242B"
  flap-tile: "#262B33"
  flap-white: "#F2F2EE"
  steel: "#8A9098"
  sign-black: "#111214"
  day-ground: "#F2F3F1"
  day-panel: "#FAFAF9"
  day-card: "#FFFFFF"
  day-flap-tile: "#E9EBEE"
  steel-light: "#5C626A"
  member-ken: "#2563EB"
  member-daniel: "#16A34A"
  member-ellen: "#EA580C"
  gate-1: "#D4A017"
  gate-2: "#4F86C6"
  gate-3: "#7C3AED"
  gate-4: "#0E9F8A"
  gate-5: "#BE185D"
typography:
  flap-display:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: 1.15
    fontFeature: "tnum"
    fontVariation: "'wdth' 75"
  flap-stat:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
    fontVariation: "'wdth' 75"
  flap-code:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.15
    fontFeature: "tnum"
    fontVariation: "'wdth' 75"
  flap-date:
    fontFamily: "Martian Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.15
    fontFeature: "tnum"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "clamp(28px, 2.6vw, 40px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  nav:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
  board-head:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  chip: "999px"
  control: "10px"
  pill: "12px"
  card-sm: "16px"
  pass: "18px"
  card: "20px"
  panel: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  nav-item:
    typography: "{typography.nav}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "46px"
  nav-item-active:
    backgroundColor: "{colors.card-slate}"
    textColor: "{colors.flap-white}"
    rounded: "{rounded.pill}"
  content-panel:
    backgroundColor: "{colors.slate-panel}"
    rounded: "{rounded.panel}"
  flap-tile:
    backgroundColor: "{colors.flap-tile}"
    textColor: "{colors.signal-yellow}"
    typography: "{typography.flap-code}"
  flap-tile-light:
    backgroundColor: "{colors.day-flap-tile}"
    textColor: "{colors.board-ink}"
  verdict-card:
    backgroundColor: "{colors.card-slate}"
    rounded: "{rounded.panel}"
    padding: "22px 30px"
  stat-card:
    backgroundColor: "{colors.card-slate}"
    textColor: "{colors.flap-white}"
    rounded: "{rounded.card}"
    padding: "16px 20px"
  board-row:
    textColor: "{colors.flap-white}"
    padding: "14px 16px"
  board-row-changed:
    rounded: "{rounded.pill}"
    padding: "14px 16px"
  changed-pill:
    backgroundColor: "{colors.alert-orange}"
    textColor: "#ffffff"
    rounded: "{rounded.chip}"
    padding: "1px 8px"
  owner-chip-board:
    textColor: "{colors.flap-white}"
    padding: "2px 7px"
  boarding-pass:
    backgroundColor: "{colors.pass-slate}"
    rounded: "{rounded.pass}"
  button-quiet:
    textColor: "{colors.steel}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  button-alert:
    textColor: "{colors.alert-orange}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
  member-chip:
    textColor: "{colors.member-ken}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
---

# Design System: BB6 課程製作

## Overview

**Creative North Star: "The Gate Board"**

BB6 reads as an airport departure board. Modules are departures, ranked by forecast completion; Gates 1 to 5 are the boarding sequence; codes, dates and figures are set as yellow split-flap characters on dark tiles, so the numbers that answer the KR question look like they were posted by the board itself. Late departures show their date in alert orange; a row whose gate or status changed since this browser last looked stays lit until someone clicks it. The bottleneck tasks are printed as boarding passes, stub and details either side of a perforation.

The world sits inside the shell the team already knows and kept on purpose: a 248px sidebar that collapses to an 80px rail, and one inset rounded panel holding rounded cards. The board world replaced the previous yellow-tile world; the solid yellow colour tiles, their decorative circles and the greeting banner are gone. Yellow is now carried by characters and one header rule, not by large fills.

Two themes ship as equals. Dark is the night board: board ink ground, slate panel and cards, yellow flap characters on graphite tiles. Light is the daytime board: pale grey ground, near-white panel, white cards, ink characters on light grey tiles, and a darker gold for yellow-family text. Density is moderate and projector-legible.

**Key Characteristics:**
- Sidebar (248px, 80px rail collapsed) + one inset rounded panel (24px).
- Split-flap mono characters for codes, dates and figures; system sans for Chinese.
- Yellow as characters and as the board's header rule; orange only for late and changed.
- Ruled board rows inside cards; boarding passes with a dashed perforation and notches.
- Hover answers with lift (cards, passes) or a 3px nudge (rows, nav), 160 to 200ms.
- Flaps flip once, two frames, only when their value changes.

## Colors

Board ink and slate at night, pale daylight greys by day; yellow speaks through characters, orange is the alarm, and member and gate hues are fixed identities.

### Primary
- **Flap Yellow** (`signal-yellow`): flap characters in dark, the 2px board-header rule, the brand name and active nav icon in dark, the current-gate segment, chart actual-progress series, focus rings, selection. Anything filled with it carries black ink (`sign-black`).
- **Daylight Gold Ink** (`accent-ink-light`): yellow-family text and the board-header rule in light theme, where #FFEA41 vanishes on white.
- **Chart Gold** (`chart-accent-light`): light-theme chart series and current-gate segment; progress fills on pale tracks.

### Secondary
- **Alert Orange** (`alert-orange`, light `alert-orange-light`): reserved for late and changed. Late rows set their 預計完工 flap characters and status in it; changed rows take an 11% wash and a 45% inset ring of it plus the 有變動 pill; the 全部標為已看過 button uses it; behind-schedule stat cards take a 45% border of it.

### Neutral
- **Board Ink** (`board-ink`): dark ground; also the flap ink in light theme.
- **Slate Panel** (`slate-panel`), **Card Slate** (`card-slate`), **Raised Slate** (`raised-slate`), **Pass Slate** (`pass-slate`): the dark tonal stack: panel, cards, raised controls, boarding passes.
- **Flap Tile** (`flap-tile`): the graphite tile behind each flap character, split by a 1px dark hinge line at 50%.
- **Flap White** (`flap-white`): primary text in dark; secondary text is the foreground at 0.72 / 0.62 alpha via `rgba(var(--fg-rgb), a)`.
- **Steel** (`steel`, light `steel-light`): column heads, stat labels, meta, idle rows.
- **Day Ground / Day Panel / Day Card / Day Flap Tile** (`day-ground`, `day-panel`, `day-card`, `day-flap-tile`): the light theme stack.
- Hairlines are the foreground at 0.05 to 0.12 alpha, never a fixed grey.

### State
- **Good / Warn** (`state-good`, `state-warn`, light variants): verdict colour, on-track status, stat-card borders (good at 40%) and chips. Warn is orange, never yellow.

### Identity hues
- **Members**: Ken (`member-ken`), Daniel (`member-daniel`), Ellen (`member-ellen`), fixed across every page. As text they use lighter inks in dark (Ken #6B9BF2) and darker inks in light (#1d4ed8 / #15803d / #c2410c). On the departure board, owner chips are neutral (foreground 8% wash, full text colour); member colour returns on the tracker, flow and login.
- **Gates 1 to 5** (`gate-1` … `gate-5`): a 45% tinted full border on gate and flow cards, with lighter text inks in dark (#E0B43A, #74A3DC, #A78BFA, #2FC0A8, #F07AAE) and darker in light (#8a6a00, #2f5f9e, #6d28d9, #0b7a68, #be185d). On the board, gate progress is the neutral segment strip, not gate hues.

### Named Rules
**The Characters-Not-Fills Rule.** Yellow appears as flap characters, one 2px rule over the board's column heads, the current-gate segment, chart series and small active marks. It is never a large surface fill behind content.

**The Alarm Rule.** Alert orange means late or changed and nothing else. If a row is neither, it carries no orange.

**The Two-Ink Rule.** Every hue used as text has a dark-theme ink and a light-theme ink. Never set #FFEA41, a member or a gate base colour as text on the light panel.

**The Fixed Identity Rule.** Member and gate colours mean one person or one gate everywhere; never reuse them as decoration or status.

## Typography

**Display Font:** Martian Mono (Google Fonts, width axis 75 to 112.5; used at `font-stretch: 75%`, weight 600, tabular figures), falling back to ui-monospace / SF Mono / Menlo.
**Body Font:** system sans (-apple-system / SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI).

**Character:** A narrow mono does the board's job: every code, date and figure sits one glyph per tile, condensed, like a split-flap unit. Chinese stays in the plain sans at 0 tracking, so the board reads as a timetable rather than a terminal.

### Hierarchy
- **Flap Display** (600, 56px; 48px under 900px): the big completion figure on the verdict card.
- **Flap Stat** (600, 28px; 24px under 900px): the four stat-card figures.
- **Flap Code** (600, 22px): module codes on board rows.
- **Flap Date** (600, 17px; 15px for pending counts): forecast dates and counts on board rows.
- **Pass Number** (Martian Mono 600, 44px, yellow ink): the stub figure on boarding passes.
- **Headline** (700, clamp 28 to 40px, 1.15): the verdict sentence, coloured by state.
- **Title** (700, 20px, 1.35): section labels and card titles, full text colour.
- **Body** (400, 15 to 16px, 1.6): verdict sub-lines, greeting line, notes.
- **Nav** (600, 16px): sidebar items; group labels 700 / 13px in steel.
- **Label** (700, 14px, steel): stat-card labels, meta, controls.
- **Board Head** (700, 13px, steel): column heads of the departure board.

### Named Rules
**The Flap Rule.** A value the board posts (module code, date, figure that answers the KR) is rendered through `flap()`, one character per tile. Chinese text is never flapped.

**The Projector Floor Rule.** Nothing on the landing page goes below 14px except chips, pills and the 13px column heads and sub-meta.

## Layout

A two-column app grid: sidebar (248px; 80px when collapsed, remembered per browser) and a fluid panel inset 16px top, right and bottom with 40px inner gutters. 專案概況 reads top to bottom: a section label with a flexible hairline and utilities on the right; the verdict card (sentence and sub-lines left, big flap figure right); four equal stat cards (16px gap); the departure-board card; then chart cards and the bottleneck passes, stacked with 24px gaps.

The board is a CSS grid row: code 88px, name 2fr, forecast 112px, gate 1.25fr, owner 112px, status 160px, with 18px column gaps. Spacing rhythm is 4 / 8 / 16 / 24 / 40px.

Breakpoints: at 1100px the owner column drops and stat cards go two-up; at 900px the sidebar becomes a sticky top bar with a menu sheet, the panel insets 8px with 20px radius and 16px gutters, the verdict card stacks, board column heads hide and each row becomes code + stacked details; at 640px grids go to one column and picker rows scroll horizontally.

## Elevation & Depth

Tonal layering at rest, lift on hover. Dark steps ground (#0B0D10) → panel → card → pass; light steps pale ground → near-white panel → white card, with a whisper of ambient shadow on cards so white-on-white separates. Shadows otherwise appear only as a response to hover.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 12px 28px rgba(0,0,0,0.35)` dark; `0 12px 28px rgba(11,13,16,0.10)` light): stat cards and boarding passes on hover, paired with `translateY(-3px)`.
- **Light card ambient** (`box-shadow: 0 1px 2px rgba(24,24,27,0.04), 0 4px 16px rgba(24,24,27,0.04)`): chart, OKR, gate and flow cards, light theme only.
- **Changed ring** (`box-shadow: inset 0 0 0 1px` alert at 45%): the changed board row's full ring.

### Named Rules
**The Lift-On-Hover Rule.** Surfaces are flat at rest in dark; a shadow appears only with hover, and goes with a lift.

## Shapes

Generous corners that step down with size: panel and verdict card 24px; stat, chart and OKR cards and modals 20px; boarding passes 18px; gate, flow and person cards 16px; nav pills, toasts and changed board rows 12px; small controls 10px; chips, status pills and the 有變動 pill fully round. Ordinary board rows are square and ruled by a 7% hairline. Flap tiles round at 0.14em with a 1px hinge line across the middle. Boarding passes split stub from details with a 2px dashed perforation and two half-circle notches (18px, card colour) bitten from top and bottom. Gate segments are 8px bars with 4px radius. Gate and member identity is a full 1px tinted border, never a bar on one edge.

## Components

### Sidebar navigation
Calm and list-like. Items are 46px pills (12px radius), 16px / 600, foreground at 75%. Hover adds a 6% wash and nudges the item `translateX(3px)`; press scales to 0.98. Active takes the card colour with a 6% inset hairline, full text colour and an accent-ink icon. The brand name is in accent ink. Groups (BB6, 每週工具) are 13px / 700 steel. External tools open in a new tab and carry a small arrow at 55% opacity. The foot holds the member chip, theme toggle and collapse. Collapsed, labels hide and items centre in the 80px rail. Under 900px the sidebar becomes a top bar whose menu button opens the nav and foot as a sheet.

### Content panel
The one big surface: panel colour, 24px radius, 5% hairline, clipped. The page footer sits inside it above a hairline, brand name in accent ink.

### Split-flap characters (signature)
`flap(value, key)` renders each character as a tile: Martian Mono 600 at 75% width, tabular, flap ink on the flap tile with a hinge line at 50%; spaces become narrow empty cells. When a keyed value changes, only the changed tiles flip once (rotateX, `steps(2)`, 240ms).

### Verdict card
Card colour, 24px radius, 22px × 30px padding. Left: the state-coloured headline, sub-lines, then the greeting line (name in full text colour). Right: the big flap completion figure with a 14px steel caption.

### Verdict scenarios
The headline stays the velocity forecast stated against the target (「比目標高 N 個百分點」); the sub-line carries the one conservative figure (保守估計, without spike weeks). Under it, a row of up to three scenario figures (速度預測, 保守估計（不計暴衝）, 只計已排程模組): static 12px-radius tiles on a 5% wash (no hover), 14px steel label and note, values through `flap()` at 20px; a scenario within 5 points of the target notes 「只高 N 個百分點」 in accent ink; below target the value is plain text with the reason (e.g. how many modules lack a forecast), never alert. A `details` toggle 「這幾個數字怎麼來的？」 holds the explanation. Below it, the bottleneck line names the gate first and the person second: 「卡最多的關卡：Gate n・name（workflow） N 個小節待處理（可開始 a・進行中 b），主要等 [chip]」, with a 看關卡瓶頸 button that scrolls to and focuses the bottleneck card.

### Stat cards
Three equal cards (目標, 需要的週速度, 近 4 週實際速度; the forecast lives in the verdict only), 20px radius, 16px × 20px padding, 6% hairline: steel label, flap figure, sub-line at 70% with an optional status chip. On track borders in good at 40%; behind borders in alert at 45%. Hover lifts.

### Departure board (signature)
Inside a chart card. Column heads (13px / 700 steel) sit under a 2px accent-ink rule. Rows are ruled by 7% hairlines and nudge 3px right on hover. Each row: flap code; name (16px bold, ellipsis) with steel meta; flap forecast date; five gate segments (done in full text colour, current in chart accent, rest at 10%) with the gate name below; neutral owner chip with a flap count; status in good, alert or steel. Not-started rows dim by colour, not opacity (steel flap characters, name at 72%), so their text keeps AA contrast; blank values are a plain steel dash, never a flap. Modules beyond the first two not-started rows sit in an idle strip of small steel flap codes under the board. The status column head reads 狀態（deadline 前）. **Late:** date flaps and status in alert ink. **Changed:** 12px radius, 11% alert wash, full 45% alert ring, and a 有變動 pill that is a real button (pulses six cycles), cleared on click of the row or pill or by the alert-outlined 全部標為已看過 button; focus then moves to the next 有變動 button or the board. When one person tops every active row, the 待處理最多 column is dropped and a single line above the board says so. Late text uses `--alert-text` (#FF6A4A dark / #A3290D light) for AA. The burn-up draws the conservative projection as a steel dotted line beside the yellow velocity line, both labelled with their end value.

### Boarding passes
Bottleneck tasks: pass-slate ground, 18px radius, 7% hairline. A 118px stub holds the 44px mono pending count in accent ink, then a dashed perforation with notches, then details. The top pass is outlined in accent ink at 55%. Hover lifts.

### Buttons and controls
Quiet: transparent, 15% foreground border, 10px radius, 14px / 700; hover strengthens border and text and lifts 1px; press scales to 0.97. Alert variant: alert text on a 10% alert wash with a 40% alert border. Segmented toggles fill the active segment with yellow and black ink.

### Chips
Fully round, 13 to 14px / 700: status chips on a 14% wash of their state colour; member chips on a 20% wash with the member ink (off the board).

### Focus
2px yellow outline, 2px offset (inset −2px inside nav pills).

## Do's and Don'ts

### Do:
- **Do** render board values (codes, dates, KR figures) through `flap()` in Martian Mono at 75% width with tabular figures.
- **Do** use the theme's accent ink for yellow-family text: #FFEA41 in dark, #6E5A00 in light.
- **Do** keep alert orange for late and changed only, and keep a changed row lit until it is clicked.
- **Do** put black ink (#111214) on any yellow fill.
- **Do** keep owner chips on the board, the bottleneck line and the boarding passes neutral, with a 7px identity dot; full member colour returns on the tracker, flow and login.
- **Do** carry gate or member identity as a full 45% tinted 1px border or a 20% wash chip.
- **Do** keep motion to 160 to 200ms transitions with `cubic-bezier(.2,.7,.2,1)`: lift `translateY(-3px)` for cards and passes, nudge `translateX(3px)` for rows and nav, flap flips only on value change; drop all of it under reduced motion.
- **Do** open external tools in a new tab, marked with the small arrow.
- **Do** re-colour charts from theme tokens when the theme changes.

### Don't:
- **Don't** bring back solid yellow colour tiles, their decorative circles, or the yellow-washed greeting banner.
- **Don't** bring back the top tab bar; navigation lives in the sidebar.
- **Don't** set #FFEA41, member or gate base colours as text on the light panel.
- **Don't** use alert orange for decoration, emphasis or the top bottleneck; the top pass is marked in accent ink.
- **Don't** mark gate or member identity with a coloured bar on one edge of a card.
- **Don't** add resting shadows in dark theme; shadow arrives only with a hover lift.
- **Don't** flap Chinese text or animate flaps that did not change.
