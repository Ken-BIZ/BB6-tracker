---
name: BB6 課程製作
description: Internal course-production tracker in the company's sidebar-and-panel tool shell, yellow on charcoal.
colors:
  signal-yellow: "#FFEA41"
  tile-gold-2: "#F6DC36"
  tile-gold-3: "#ECCD2C"
  tile-gold-4: "#E0BC22"
  chart-amber: "#F59E0B"
  accent-ink-light: "#735e00"
  chart-accent-light: "#A68600"
  charcoal-ground: "#111214"
  panel-graphite: "#1b1c1f"
  raised-graphite: "#232428"
  bone-text: "#f4f4f2"
  muted-slate: "#9599A4"
  paper-ground: "#f3f2ee"
  panel-white: "#ffffff"
  ink-text: "#18181b"
  muted-slate-light: "#5f616a"
  state-good: "#4ade80"
  state-warn: "#FB923C"
  state-bad: "#f87171"
  state-good-light: "#15803d"
  state-warn-light: "#c2410c"
  state-bad-light: "#b91c1c"
  member-ken: "#2563EB"
  member-daniel: "#16A34A"
  member-ellen: "#EA580C"
  gate-1: "#D4A017"
  gate-2: "#4F86C6"
  gate-3: "#7C3AED"
  gate-4: "#0E9F8A"
  gate-5: "#BE185D"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontFeature: "tnum"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "clamp(28px, 2.6vw, 40px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  greeting:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI, sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1.2
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
rounded:
  chip: "999px"
  control: "10px"
  pill: "12px"
  card-sm: "16px"
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
    textColor: "{colors.bone-text}"
    rounded: "{rounded.pill}"
  content-panel:
    backgroundColor: "{colors.panel-graphite}"
    rounded: "{rounded.panel}"
  kr-tile:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.charcoal-ground}"
    rounded: "{rounded.panel}"
    padding: "26px 28px"
    height: "200px"
  kr-tile-chip:
    backgroundColor: "{colors.charcoal-ground}"
    textColor: "{colors.state-good}"
    rounded: "{rounded.chip}"
    padding: "4px 12px"
  chart-card:
    rounded: "{rounded.card}"
    padding: "28px 32px"
  button-quiet:
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  member-chip:
    textColor: "{colors.member-ken}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
---

# Design System: BB6 課程製作

## Overview

**Creative North Star: "The Department Desk"**

BB6 lives inside the company's internal-tool family: a quiet sidebar on a charcoal ground, one big rounded content panel floating beside it, a greeting banner that names who is looking and what is waiting on them, and a row of solid yellow tiles that carry the four KR numbers. It should sit next to the sibling department tool and read as the same house, while keeping the company's binding pairing of signal yellow on near-black.

Density is moderate and legible from a projector: heavy numerals, a 14px floor on the landing page, and one strong colour field (the yellow tile row) per screen. Everything else is tonal graphite in dark and warm paper in light, with gate and member hues reserved for identification, never decoration. The old top-tab bar with a yellow rule and flat square cards is retired.

Two themes ship as equals. Dark is the default; light mirrors the structure on a warm paper ground with a white panel and darker inks so every hue holds contrast on white. Switching themes happens in place, and charts re-colour without a reload.

**Key Characteristics:**
- Sidebar (248px, collapsible to an 80px icon rail) + one rounded content panel (24px radius).
- Signal yellow as fill, not as line: tiles, active pills, chart series.
- Black ink on yellow, always; yellow text only where it holds contrast (dark theme) or via the dark-gold ink in light.
- Line icons at 1.75 stroke, 20px.
- System sans with heavy (800) tabular numerals.
- Motion limited to 180ms state transitions.

## Colors

One signal colour on graphite or paper, with fixed identity hues for people and gates.

### Primary
- **Signal Yellow** (`signal-yellow`): the company colour. Fills the first KR tile, the chart's actual-progress series in dark, the greeting banner tint (7% into the panel in dark, 26% into white in light), the active nav pill tint (14% into panel in dark, 32% into white in light), focus rings, selection and the "mine" row wash. Text set in it only on the dark ground.
- **Tile Golds** (`tile-gold-2`, `tile-gold-3`, `tile-gold-4`): the deepening family for tiles two to four, so the row reads as one field with a gentle gradient rather than four identical slabs.
- **Chart Amber** (`chart-amber`): the secondary chart series in dark (light uses #b45309).
- **Dark Gold Ink** (`accent-ink-light`): yellow-family text in light theme (greeting, active nav icon, footer brand), where #FFEA41 would vanish on white.
- **Chart Gold** (`chart-accent-light`): the light theme's chart series colour.

### Neutral
- **Charcoal Ground** (`charcoal-ground`): dark page ground behind the sidebar; also the ink on every yellow surface and the chip ground inside tiles.
- **Panel Graphite** (`panel-graphite`): the dark content panel. Raised elements step up to `raised-graphite`.
- **Bone Text** (`bone-text`): primary text in dark. Secondary text is the same foreground at 0.75 / 0.65 / 0.5 alpha via `rgba(var(--fg-rgb), a)`.
- **Muted Slate** (`muted-slate` / `muted-slate-light`): group labels, meta, quiet controls.
- **Paper Ground** (`paper-ground`) and **Panel White** (`panel-white`): the light theme's ground and panel; **Ink Text** (`ink-text`) is its foreground.
- Hairlines are the foreground at 0.06 to 0.12 alpha, never a fixed grey.

### State
- **Good / Warn / Bad** (`state-good`, `state-warn`, `state-bad` in dark; the `-light` variants in light): verdict colour, tile status chips, deltas. Warn is orange, not yellow, so it never collides with the brand.

### Identity hues
- **Members**: Ken (`member-ken`), Daniel (`member-daniel`), Ellen (`member-ellen`). Fixed across every page. As text they use the lighter inks (#7BAEFF / #6EE7A0 / #FDBA74 in dark; #1d4ed8 / #15803d / #c2410c in light); as chips they sit on a 20% wash of the base colour.
- **Gates 1 to 5** (`gate-1` … `gate-5`): carried as a 45% tinted full border on gate cards and as lighter text variants (#E0B43A, #74A3DC, #A78BFA, #2FC0A8, #F07AAE in dark; #8a6a00, #2f5f9e, #6d28d9, #0b7a68, #be185d in light).

### Named Rules
**The Yellow-Is-A-Fill Rule.** Signal yellow appears as a surface (tile, pill tint, banner wash, chart bar) with black ink on it. It is never a rule line under a header.

**The Two-Ink Rule.** Every hue used as text has a dark-theme ink and a light-theme ink. Never set the base #FFEA41, member or gate colour as text on white.

**The Fixed Identity Rule.** Member and gate colours mean one person or one gate everywhere; never reuse them as decoration or as a status.

## Typography

**Display Font:** system sans (-apple-system / SF Pro Text, PingFang TC, Noto Sans TC, Microsoft JhengHei, Segoe UI)
**Body Font:** the same stack

**Character:** One family, weight does the work. Numerals go to 800 with tight negative tracking and tabular figures so KR numbers read across a room; Chinese text stays at 0 tracking.

### Hierarchy
- **Display** (800, 56px, 1): KR tile values. 38px under 900px.
- **Greeting** (800, 34px, 1.2): the banner greeting, in the accent ink. 26px under 900px.
- **Headline** (700, clamp 28 to 40px, 1.15): the KR verdict sentence, coloured by state.
- **Title** (700, 20px, 1.35): section labels and chart-card titles, in full text colour.
- **Body** (400, 16px, 1.6): greeting line, verdict sub-lines, explanatory copy.
- **Nav** (600, 16px): sidebar items; group labels 700 / 13px in muted slate.
- **Label** (700, 14 to 15px): tile labels, meta, controls. Chips may drop to 13px.

### Named Rules
**The Projector Floor Rule.** Nothing on the landing page goes below 14px except chips and pills.

**The Heavy Numeral Rule.** Every number that answers the KR question is weight 800 with `tabular-nums`.

## Layout

A two-column app grid: sidebar (248px; 80px when collapsed, remembered) and a fluid panel inset 16px from the top, right and bottom, with 40px inner gutters. The panel opens with a right-aligned utility row (data timestamp, settings), then a full-width greeting banner split 0.85 : 1.6 between greeting and verdict with a hairline between, then section labels followed by a flexible hairline, then four equal 200px tiles (16px gap), then full-width chart cards stacked with 24px gaps.

Spacing rhythm is 4 / 8 / 16 / 24 / 40px. Breakpoints: at 1100px the banner stacks and tiles go two-up; at 900px the sidebar becomes a sticky top bar with a menu toggle, the panel insets 8px with 20px radius and 16px gutters, and collapse is hidden; at 640px gate and member grids go to one column and picker rows scroll horizontally. Desktop first; mobile needs to be readable.

## Elevation & Depth

Tonal layering, not shadow. In dark, depth comes from ground (#111214) → panel (#1b1c1f) → card (3% foreground wash plus a 6% hairline) → raised (#232428). In light, the white panel on paper does the same job, and cards gain a whisper of ambient shadow so white-on-white still separates.

### Shadow Vocabulary
- **Light card lift** (`box-shadow: 0 1px 2px rgba(24,24,27,0.04), 0 4px 16px rgba(24,24,27,0.04)`): chart cards, OKR objective cards, gate and flow cards, light theme only.

### Named Rules
**The Flat-In-The-Dark Rule.** Dark theme uses no shadows; separate surfaces by tone and hairline.

## Shapes

Generous, soft corners that step down with size: panel, banner and tiles 24px; chart and OKR cards, modals 20px; gate, flow and person cards 16px; nav pills, toasts and the member chip 12px; small controls 10px; status chips and tags fully round (999px). Gate and member identity is a full 1px tinted border around the card, never a bar on one edge. Each KR tile carries one soft circle (6% charcoal) bleeding off a different corner, the only decorative geometry in the system.

## Components

### Sidebar navigation
Calm and list-like. Items are 46px pills (12px radius), 16px / 600, foreground at 75%. Hover adds a 6% foreground wash; active gets the yellow-tinted pill, full text colour and a yellow (accent-ink) icon. Groups (BB6, 每週工具) are labelled in 13px / 700 muted slate. External links carry a small arrow at 55% opacity. The foot holds the member chip, theme toggle and collapse, above an 8% hairline. Collapsed, labels hide and items centre in an 80px rail. Under 900px it becomes a top bar with a menu button.

### Content panel
The one big surface: panel colour, 24px radius, clipped. Page footer sits inside it above a hairline, the brand name in accent ink.

### Greeting banner
A yellow-washed band (24px radius, 34px × 40px padding): greeting in accent ink at 800, pending-load line below, verdict to the right behind a vertical hairline.

### KR tiles (signature)
Four solid yellow-family tiles, black ink, 24px radius, min 200px tall: label (15px / 700 at 70% ink), 56px numeral, sub-line at 75% ink, optional status chip (charcoal pill, good-green or warn-orange text) pinned to the bottom. One soft circle per tile, positioned differently on each.

### Cards
Chart cards: card wash, 6% hairline, 20px radius, 28px × 32px padding (20px on mobile). Titles 20px / 700 in full text colour, sub-lines 14px at 65%.

### Buttons and controls
Quiet: transparent with a 15% foreground border, 10px radius, 14px / 700, hover strengthens border to 35% and text to full. Transitions 0.15 to 0.18s on colour only.

### Chips
Status and tags are fully rounded, 13 to 14px / 700, on a 6% foreground wash or a 20% wash of the member colour with the member ink.

### Focus
2px signal-yellow outline, 2px offset (inset −2px inside nav pills).

## Do's and Don'ts

### Do:
- **Do** put black ink (#111214) on every yellow surface, in both themes.
- **Do** use the theme's accent ink for yellow-family text: #FFEA41 in dark, #735e00 in light.
- **Do** keep KR numbers at weight 800 with tabular figures, and the landing page at a 14px floor.
- **Do** draw line icons at 20px with a 1.75 stroke, round caps and joins.
- **Do** carry gate or member identity as a full 45% tinted 1px border or a 20% wash chip.
- **Do** keep motion to 180ms colour and layout transitions, and drop them under reduced motion.
- **Do** re-colour charts from the theme tokens when the theme changes.

### Don't:
- **Don't** bring back the top tab bar with a yellow rule under the header.
- **Don't** set #FFEA41, member or gate base colours as text on the light panel.
- **Don't** mark gate or member identity with a coloured bar on one edge of a card.
- **Don't** add shadows in dark theme.
- **Don't** reuse member or gate hues for status or decoration.
