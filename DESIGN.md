# Design

Visual system for Lume. Source of truth for tokens; PRODUCT.md is source of truth for voice and strategy. When this file and the code disagree, this file wins — fix the code.

Direction chosen 2026-05-05 after probe comparison: **Mono + Lime · Geist** (Probe B). Replaces the previous "Quente Editorial" (cream + terracotta + Instrument Serif) direction.

## Theme

Light only. Near-white surface tinted toward cool neutral; near-black ink tinted the same. Lime accent enters as punctuation, never as decoration.

Dark mode is out of MVP. Re-evaluate at v1.5 with a real dark scene-sentence; do not auto-invert tokens.

## Color

Strategy: **Restrained.** Ink + neutrals carry the surface. Lime is the single committed accent, used at <10% of any frame.

OKLCH only. Never `#000` / `#fff`. Every neutral tinted toward the cool axis (220° hue, chroma 0.003–0.012).

### Tokens

```css
:root {
  /* Surface */
  --bg:            oklch(0.985 0.003 220);   /* page */
  --surface:       oklch(1.000 0.001 220);   /* cards, sheets */
  --surface-sunk:  oklch(0.965 0.004 220);   /* inputs, dropzones */

  /* Ink */
  --ink:           oklch(0.140 0.008 220);   /* primary text, ink-heavy ui */
  --ink-2:         oklch(0.420 0.006 220);   /* secondary text */
  --ink-3:         oklch(0.600 0.005 220);   /* tertiary text, captions */
  --ink-inverse:   oklch(0.985 0.003 220);   /* text on ink */

  /* Accent — lime */
  --accent:        oklch(0.860 0.210 130);   /* primary accent surface */
  --accent-deep:   oklch(0.300 0.090 130);   /* text-on-accent */
  --accent-soft:   oklch(0.960 0.060 130);   /* glows, soft fills */
  --accent-edge:   oklch(0.760 0.180 130);   /* hovered borders */

  /* Lines */
  --border:        oklch(0.920 0.005 220);   /* default */
  --border-strong: oklch(0.850 0.006 220);   /* dashed dropzones, dividers */
  --border-ink:    oklch(0.140 0.008 220);   /* rare; only when ink-strong stroke is intentional */

  /* States */
  --danger:        oklch(0.55 0.18 25);
  --danger-soft:   oklch(0.96 0.04 25);
  --warn:          oklch(0.72 0.15 75);
  --warn-soft:     oklch(0.97 0.04 75);

  /* Focus ring (a11y) */
  --focus:         oklch(0.860 0.210 130);   /* lime; offset, never outline-default */
}
```

### Use rules

- **Hierarchy via ink, not color.** Headings are `--ink`, body `--ink-2`, captions `--ink-3`. Never use accent for body text or headings unless the surface IS the accent.
- **Accent is punctuation.** Highlight on a single word, focus ring, status dot, primary button surface, single-cell highlight inside a chart. If a frame has ≥3 lime touches, remove the weakest.
- **Buttons.** Primary CTA = `bg: var(--ink); color: var(--ink-inverse)` with a lime indicator dot. Secondary = ghost (transparent + ink border on hover). The accent is never the button background — that route reads PicPay-clone.
- **Status colors** (`danger`, `warn`) are reserved for system feedback only, never decorative.
- **Contrast.** Body text 4.5:1 minimum on `--bg`. UI lines 3:1 minimum. Lime on white is large-text only (≥18pt or 14pt bold) — never small text.

## Typography

**Geist** (sans, variable) + **Geist Mono**. Loaded via `next/font/google` to avoid layout shift; no fallback to system fonts in the rendered UI.

Geist is already a recognizable face — pair it with deliberate kerning, mono punctuation in numerics, and tight letter-spacing rather than another display face. Banned: any serif (Instrument Serif, Fraunces, Source Serif, Newsreader, EB Garamond), any AI-default look (Söhne-Linear-clone, system-ui, Inter as primary).

### Scale

Modular ratio 1.250 (major third). Mobile defaults; clamp to up-shift gracefully.

| Role            | Font   | Size (mobile)         | Size (≥768px)         | Weight | Letter-spacing |
|-----------------|--------|-----------------------|-----------------------|--------|----------------|
| Display L       | Geist  | clamp(40px, 9vw, 56px)| 64px                  | 600    | -0.045em       |
| Display M       | Geist  | clamp(32px, 7vw, 40px)| 48px                  | 600    | -0.040em       |
| H1              | Geist  | 28px                  | 36px                  | 600    | -0.035em       |
| H2              | Geist  | 22px                  | 26px                  | 600    | -0.028em       |
| H3              | Geist  | 18px                  | 20px                  | 600    | -0.022em       |
| Body L          | Geist  | 17px                  | 18px                  | 400    | -0.012em       |
| Body            | Geist  | 15px                  | 16px                  | 400    | -0.010em       |
| Body S          | Geist  | 13.5px                | 14px                  | 400    | -0.005em       |
| Caption         | Geist  | 12px                  | 12px                  | 500    | 0              |
| Eyebrow         | Geist  | 11px                  | 11px                  | 500    | 0.10em UPPER   |
| Mono            | GMono  | 13px                  | 13px                  | 500    | -0.005em       |

Line-height: 1.02 on Display, 1.05 on H1, 1.2 on H2/H3, 1.55 on Body, 1.5 on captions.

Body line length capped at **65–70ch**.

### Numerals

Numbers use **Geist Mono** in tabular contexts (file sizes, percentages, money totals, step counters, file lists). Inline body text uses Geist with `font-feature-settings: "tnum", "ss01"`. Currencies render as `R$ 1.234,56` (PT-BR locale) — never abbreviated to "R$1.2k" in the report or UI.

### Wordmark

`lume` lowercase, Geist 600, letter-spacing -0.04em. One custom decoration: a 9×4 lime rectangle pulse on the right of the "e," animated `blink` 2.4s ease-out-expo. The pulse is the brand mark — do not duplicate elsewhere on the page.

## Layout

Mobile-first. Default container `max-w: 432px` and centered up to `≥640px`. From `768px` open to `max-w: 720px` (single-column reading) for content surfaces. From `1024px` allow split layouts (upload + preview, conta + sections) with a 480px primary column and a 320–360px secondary rail.

Spacing scale (rem, base 16px):
```
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 80 / 120
```
Vary, don't pad uniformly. Hero ↔ next section: `80–120`. Section internal: `40`. Component internal: `16–24`.

### Surfaces

- **Frame radius:** outer card / sheet `28px`. Inner cards `16–18px`. Inputs and small chips `10–12px`. Pills/buttons `12–14px`.
- **Borders:** 1px solid `--border` default; 1.5px dashed `--border-strong` for dropzones and "drop-here" affordances.
- **Shadow:** never decorative. Two recipes only — `0 1px 0 oklch(0.96 0.005 220 / 0.7), 0 8px 30px -16px oklch(0.10 0.005 220 / 0.18)` for elevated surfaces; nothing on flat surfaces.

### Anti-patterns (banned, repeating SKILL.md + project-specific)

- Hero-metric template (big-number + small-label + supporting stats). Lume's results are always sentences first, numerals second.
- Identical card grid (icon + heading + text repeated). Use list rows with mono numerals and varying widths for "what the report shows."
- Side-stripe colored borders (border-left lime). Never.
- Glassmorphism, gradient text, decorative gradients on text or chrome.
- Bottom-tab nav (PicPay-clone). This is a website; navigate with header + footer + in-flow CTAs.

## Components

### Button

```
Primary:    bg ink, fg ink-inverse, lime indicator dot left.
Secondary:  bg transparent, fg ink, 1px border-ink hover.
Ghost:      bg transparent, fg ink-2 hover ink, no border.
Destructive: bg danger, fg surface, no dot.
```

Default `padding: 14px 20px`, radius 12, font-weight 600, letter-spacing -0.012em.
Hover: translateY(-1px) ease-out-expo 220ms. Active: translateY(0) scale(0.985).
Focus-visible: 2px solid `--focus`, 2px offset.
Disabled: `--ink-3` text, `--surface-sunk` bg, no transform.

### Wordmark + topbar

Header is sticky, `bg: var(--surface)` with `border-bottom: 1px solid var(--border)` only after scroll > 0. 56px tall mobile, 72px desktop. Wordmark left, single right action (entrar / minha conta / fechar).

### Dropzone

Dashed border `--border-strong`, radius 18, padding 28×20. Hover: border `--ink`, radial lime-soft glow from top-center (scoped to the dropzone, never page-wide). Icon block 44×44, radius 12, ink fill, lime stroke icon.

### Input

Radius 10. Padding 12×14. Border 1px `--border`. Background `--surface-sunk`. Focus: border `--focus` + 2px lime ring inset. Label always visible above (no float-label).

### Stepper

Horizontal row, mono numerals (`01`, `02`, `03`) inside ink-filled 22×22 squares with lime text. Inactive squares: transparent, ink-3 mono text, `--border-strong` 1px border. Connecting lines: 1px `--border`. Eyebrow caption `UPPER 0.10em` for current step name.

### Microcards (privacy, copy)

14×16 padding, radius 12, `--bg` surface inside `--surface` parent (one level of recess). Icon 28×28, radius 8, ink-filled, lime-stroked icon. Text body S, ink-2 with ink b-tags.

### Accordion (bank instructions)

`--border` lines, no card chrome. Trigger: H3 size, ink, chevron right (rotates 90° on open, ease-out-expo 280ms). Content: body, padding-left 0 (no indent — content reads as continuation, not nested).

### File list

Each row: file icon (mono outlined), filename (Geist 15, ink), size (Geist Mono 13, ink-3), remove button (ghost, X icon, 32×32 hit). Row separator: 1px `--border`. Hover: `--surface-sunk` background.

### Result PDF preview

A4 ratio frame, radius 18, 1px `--border`. Subtle lime "READY" pill at top-right (Eyebrow style + lime soft bg + lime deep text). Click → downloads. No glass / blur effects.

## Motion

`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`. Default duration 220ms (button), 320ms (focus shifts), 480ms (page transitions), 720ms (entry choreography).

### Banned motion

- Bounce / elastic / overshoot.
- Animating CSS layout properties (width, top, left, padding, margin). Use transform / opacity.
- Auto-playing background animations on load (parallax hero, animated blob backgrounds).
- Animated gradients on text or buttons.

### Allowed and required motion

- **Wordmark blink:** 2.4s ease-out-expo, scaleX 1→0.4→1, opacity 1→0.5→1. Always on.
- **Button hover:** translateY -1px / 220ms.
- **Button arrow:** translateX +3px on parent hover / 320ms.
- **Dropzone hover glow:** opacity 0→1 / 360ms.
- **Stepper advance:** active square crossfade + the next square's number tick up via `tabular-nums` (no Lottie).
- **SSE step reveal:** each processing step fades in (opacity 0→1, translateY 4→0) / 320ms, staggered by 80ms.
- **Page transitions:** view-transitions API for navigations. Cross-fade 240ms for non-spatial; slide-up 320ms for upload → processar → resultado.
- **Result reveal:** PDF preview scales in 0.96→1, opacity 0→1, 480ms ease-out-expo. Heading types in via `text-wrap: balance` + opacity stagger (no character-by-character typewriter).
- **Reduced motion:** all the above collapse to opacity-only fades ≤120ms or no movement at all. Wordmark blink stops.

## Iconography

Lucide React (already a dependency). 1.5–2px stroke, rounded caps + joins. Filled glyphs banned in the UI; filled is reserved for ink-on-lime icon blocks (the dropzone icon, privacy icon).

Custom illustrations replace any stock pattern. If an illustration is needed (empty state, onboarding, error 404, cap reached), commission or hand-author SVG; never Storyset, undraw, or Lottie packs.

## Voice in UI

PT-BR. Lowercase wordmark, sentence-case headings, Title Case forbidden. Frasing principles in PRODUCT.md; this file enforces:

- Numbers separated by `·` middle-dot, never em dash and never `--`.
- File counts and sizes mono. Percentages mono.
- "R$" with a space before the value; thousands `.`; decimals `,`.
- Status microcopy in Eyebrow style (e.g. `PRIVACIDADE`, `EM ANDAMENTO`).

## Out of system

Anything not in this file is not part of the system. New tokens, new fonts, new components require a DESIGN.md update (or run `$impeccable extract`) before merging. No drive-by additions.
