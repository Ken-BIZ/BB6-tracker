# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A small internal course-production team: Daniel (project lead; owns the OKR and module settings), Ken and Ellen (producers who report progress section by section; Ken also has full edit rights across gates). Two situations matter most:

- **Weekly meeting, shared screen.** The team reviews 專案概況 and OKR together on a projector or shared display, asking whether the KR is on pace and where work is stuck.
- **Day-to-day reporting at a desk.** Ken and Ellen open 進度填報 on their own computers to tick off tasks per module, section and gate.

## Product Purpose

BB6 課程製作 tracks the production of the BOP 6.0 Workshop course materials (translation, AI video production, transcript layout, summaries, QC) toward the 2026 Q4 objective: finish launch preparation so the workshop can be offered from March 2027.

Success means anyone can tell **at a glance whether the KR will be met**: how far the project is, whether the pace holds against the deadline and milestones, and which module, gate or person is the bottleneck.

## Positioning

Not a generic task tracker. Progress is computed from a fixed production pipeline (modules → sections → five gates of tasks, in either the legacy or the AI-collaboration workflow per module), weighted by task hours, and projected onto working days that skip Taiwan national holidays. The KR's completion figure comes straight from that reporting, so the team never maintains a separate status report.

## Operating Context

- Pages: 專案概況 (landing page: KR burn-up, pace, contribution, bottlenecks), OKR, 整體專案進度, 進度填報, 流程分工 (who hands off to whom, per gate).
- Identity is picked on the page (no login); edit rights are enforced in the UI by member (e.g. only Daniel edits O/KR; Ken/Daniel edit forecast settings).
- Shared realtime state in Supabase: scores, log, baseline settings, OKR tables. Schema changes ship as SQL in `supabase/` and must be run before the matching page change deploys.
- Deployed as a static page plus a tiny serverless config endpoint (`api/config.js`).
- Language: Traditional Chinese (Taiwan), with English for member names and module codes (C1–C19, TA1…).

## Capabilities and Constraints

- Single `index.html` (HTML/CSS/JS inline), no build step or framework.
- Internal use only; not public-facing.
- Desktop first. Mobile only needs to be readable, not fully operable.
- Must stay legible on a projector: KR state and bottlenecks have to read from across a room.
- Terminology to keep: 模組, 小節, Gate 1–5, 任務, KR, 完工預測, 年底目標.

## Brand Commitments

- Company identity: yellow `#FFEA41` on near-black, with the BC logo (`BC_logo.png`, `logo-mark.png`, `favicon.png`). This pairing is binding.
- Each member has a fixed identifying colour used across pages (Ken, Daniel, Ellen).

## Evidence on Hand

Real, live production data in Supabase (scores, logs, OKR). No external users, testimonials or public claims exist or should be invented.

## Product Principles

1. The KR answer comes first: on track or not, by how much, and why, before any detail.
2. Reporting must be cheap, so the data stays current; every extra click on 進度填報 costs accuracy everywhere else.
3. One rule, everywhere: pace, forecast and completion are computed the same way on every page.
4. Name the bottleneck: when work is stuck, show which module, gate and person it is waiting on.
5. Read from the back of the room: shared-screen review is a primary use, not an afterthought.
