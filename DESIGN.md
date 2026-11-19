---
name: Cupang Elementary School (CESMAIN)
description: The schoolhouse front, a hand-painted green signboard over a row of wood-framed window bays.
colors:
  board: "#1f5a32"
  board-hi: "#276b3d"
  wall: "#0f3a20"
  wall-2: "#0b2e19"
  wood: "#7a4a2a"
  wood-dark: "#5c3620"
  pane: "#e4ebe3"
  pane-2: "#d3ddd1"
  gold: "#efc45e"
  gold-ink: "#6b4d06"
  ink: "#13261a"
  ink-2: "#3d5545"
  on-wall: "#e4ebe3"
  on-wall-2: "#bcd9c4"
  sign-paint: "#f1f3ec"
  field-bg: "#f6f8f5"
  field-line: "#b8c6ba"
  danger: "#a3332a"
  danger-on-wall: "#f0a399"
  cat-exam: "#5b4a8a"
  cat-program: "#8a6410"
  ops-bg: "#eef2ed"
  ops-card: "#fbfcfa"
  ops-line: "#cfd9d0"
  ops-muted: "#4d6353"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 8.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.01em"
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.25rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.01em"
  painted-line:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(.95rem, 1.6vw, 1.3rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.24em"
  numeral:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 900
    lineHeight: 0.9
    fontFeature: "tnum"
  lede:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: ".875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  ops-body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  ops-title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "30px"
    fontWeight: 900
    lineHeight: 1
rounded:
  none: "0"
spacing:
  frame: "12px"
  gutter: "clamp(16px, 4vw, 56px)"
  bay-pad: "clamp(20px, 2.4vw, 32px)"
  section: "clamp(56px, 8vw, 104px)"
  section-head: "28px"
  eave: "14px"
  ops-gap: "24px"
  ops-card-pad: "20px"
components:
  button-primary:
    backgroundColor: "{colors.board}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.wall}"
    textColor: "#ffffff"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.board}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-ghost-hover:
    backgroundColor: "{colors.board}"
    textColor: "#ffffff"
  button-outline-on-wall:
    backgroundColor: "transparent"
    textColor: "{colors.on-wall}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-outline-on-wall-hover:
    backgroundColor: "{colors.on-wall}"
    textColor: "{colors.wall}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.on-wall-2}"
    typography: "{typography.label}"
    padding: "10px 14px"
  nav-link-active:
    textColor: "{colors.gold}"
  signboard:
    backgroundColor: "{colors.board}"
    textColor: "{colors.sign-paint}"
    rounded: "{rounded.none}"
    padding: "clamp(20px, 3vw, 40px) clamp(20px, 4vw, 56px)"
  window-bay:
    backgroundColor: "{colors.pane}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.bay-pad}"
  input-field:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  today-chip:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "5px 8px"
  sample-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    rounded: "{rounded.none}"
    padding: "5px 8px"
  ops-card:
    backgroundColor: "{colors.ops-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.ops-card-pad}"
  ops-button:
    backgroundColor: "{colors.board}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  ops-button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.board}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  ops-topbar:
    backgroundColor: "{colors.wall}"
    textColor: "#ffffff"
    padding: "10px 24px"
---

# Design System: Cupang Elementary School (CESMAIN)

## Overview

**Creative North Star: "The Schoolhouse Signboard"**

The site is the front of the schoolhouse. A hand-painted enamel-green signboard carries the seal and the school's lettered name; beneath it hangs a row of window bays framed in thick narra wood, and each bay is a light capiz pane you read through. Everything else sits on a deep green wall. The metaphor is structural, not decorative: frames are real borders and grid gaps in wood colour, panes are the only light reading surfaces, and the gold of the seal's torch is the single accent.

The public pages are dark, painted and plain-spoken: condensed signage capitals for anything that would be lettered on a building, a highly legible humanist sans for everything a community member reads. Density is generous (18px body, wide gutters, 56–104px between sections) because the audience includes older residents reading on phones. There are no textures, no faux distress and no rounded corners; the "paint" is flat colour.

The staff dashboards (principal and teacher) are the same world in its restrained, light **Operate** form: the wood eave and the deep-green bar stay at the top, signage capitals stay on section titles, but the work surface turns to pale paper cards with hairline borders, a 15px body and compact controls. The world is carried by the strip and the headings, not by frames around every card.

**Key Characteristics:**
- One painted signboard per page (full on Home, `small` on inner pages), always board green framed in 12px wood.
- Content lives in window bays: pane-coloured cells separated by 12px wood mullions (grid gap = frame width).
- Square corners everywhere; borders are the form language.
- Gold is the one accent: current nav item, today marker, focus ring, painted line, history years.
- Signage caps (Big Shoulders Display 900, uppercase) for names and headings; Atkinson Hyperlegible for reading.
- Signature motion: bays open like shutters (clip-path) the first time they enter view; reduced motion shows them open.
- Dashboards: light, flat, compact, same fonts, same greens, no frames.

## Colors

Painted-school greens on a shadowed wall, warm wood for structure, a pale green-grey pane for reading, and one torch gold.

### Primary
- **Enamel Board Green** (board): the signboard, the footer, the core-values board, primary buttons, headings inside panes, FullCalendar buttons and the default event colour. In the dashboards it is the primary action and heading colour.
- **Lifted Board** (board-hi): a lighter board step defined for highlights; reserved, currently unused by components.

### Secondary
- **Narra Wood** (wood): every frame. The eave strip, signboard border, bay mullions, span-photo mullions, history rail, footer top edge, login drawer edge, scrollbar thumb. Also the PTA category colour.
- **Dark Narra** (wood-dark): the 2px shadow line under the eave and footer frame.

### Tertiary
- **Torch Gold** (gold): the single accent, from the flame in the seal. Active nav underline and text, the `Today` chip and today cell in the calendar, the 3px focus outline, the painted line under the school name, history-rail years and stops, record years, text selection, the skip link. Field focus uses it as a 3px glow at 60% alpha.
- **Gold Ink** (gold-ink): gold dark enough to read on a pane: today's day numeral, the feature placing numeral ("3rd").

### Neutral
- **Shadowed Wall** (wall): page background, sticky nav, primary-button hover, dashboard top bar.
- **Deep Wall** (wall-2): footer base strip, photo bay fallback, scrollbar track.
- **Capiz Pane** (pane): the reading surface inside bays, calendar board, feature, login drawer. `on-wall` shares this value for primary text on the wall.
- **Pane Shade** (pane-2): dividers inside panes, FullCalendar neutral and list-hover backgrounds.
- **Schoolroom Ink** (ink): text on panes and gold.
- **Faded Ink** (ink-2): secondary text on panes, table headers, metadata.
- **Faded Sign Green** (on-wall-2): secondary text on the wall, inactive nav, motto.
- **Sign Paint** (sign-paint): the near-white of lettering painted on green (signboard h1, values, footer headings).
- **Field White / Field Line** (field-bg / field-line): input surface and resting border.
- **Report Red** (danger): errors, invalid fields, the SAMPLE stamp, Holiday category. On the wall the stamp lightens to **danger-on-wall**.
- **Category colours**: General = board, Holiday = danger, Exam (cat-exam), PTA = wood, Program (cat-program). Always paired with a text legend.
- **Operate neutrals** (dashboards only): ops-bg page, ops-card cards, ops-line hairlines, ops-muted labels/metadata; table headers use pane.

### Named Rules
**The One Torch Rule.** Gold is the only accent and it always means "here / now / focus": current page, today, keyboard focus, the painted line. Never use it as a fill for decoration or a second CTA colour by default.

**The Pane Rule.** Long reading happens on pane (light) surfaces in ink, or on the wall in on-wall. Never set body copy on board green inside a bay; board green is for signs, not for reading.

## Typography

**Display Font:** Big Shoulders Display, weights 700 and 900 (with Arial Narrow, sans-serif)
**Body Font:** Atkinson Hyperlegible, weights 400/700 and italic 400 (with system-ui, sans-serif)

**Character:** Condensed signwriter capitals against a typeface designed for low-vision readers: the board shouts the name, the pane speaks plainly.

### Hierarchy
- **Display** (900, clamp(2.75rem, 8.4vw, 6rem), 0.95, uppercase): the school name on the signboard only. Inner-page signboards use clamp(2.5rem, 7vw, 5rem).
- **Headline** (900, clamp(2.25rem, 5vw, 3.75rem), 0.95, uppercase): section heads on the wall and split-section headings.
- **Title** (900, clamp(1.75rem, 2.6vw, 2.25rem), 0.95, uppercase, board green): headings inside bays; calendar board and drawer titles use fixed 1.75rem / 2.6rem.
- **Painted line** (Big Shoulders 700, clamp(.95rem, 1.6vw, 1.3rem), 0.24em tracking, uppercase, gold): the single facts line under the school name (est. year, school ID, city). It follows the name; it never precedes a heading.
- **Numeral** (Big Shoulders 900, 2.6rem/0.9, tabular): event day numbers; same face at larger sizes for history years (clamp(3rem, 7vw, 5.5rem)) and the placing numeral.
- **Lede** (400, 1.25rem/1.55, max 62ch): opening paragraph of a section.
- **Body** (400, 1.125rem/1.6): all reading text; prose max 68ch, section intros 52ch.
- **Label** (700, .875rem, 0.12–0.14em, uppercase): nav, buttons (.95rem, 0.08em), table headers (.75rem), event metadata (.8rem), chips (.7rem).
- **Operate** (dashboards): 15px body, 13–14px labels and tables, Big Shoulders 900 at 30px for card titles, 22px for sub-titles, 28px for dialog titles.

### Named Rules
**The Lettered Name Rule.** Anything that would be painted on the building (school name, section names, values, years) is Big Shoulders uppercase. Anything a person reads as a sentence is Atkinson in sentence case.

## Layout

The page is a vertical stack against the wall: eave (14px wood) → sticky top nav → signboard → bays → sections → footer. Horizontal inset is a single fluid gutter, clamp(16px, 4vw, 56px); sections are spaced clamp(56px, 8vw, 104px) apart with a 28px gap under section heads.

Window bays are a CSS grid of `--cols` equal columns (3 by default; 2 for contact and mission/vision; 1 for intro bays) whose gap and outer border are both the 12px frame in wood, so the wood shows through as mullions. A bay row directly under the signboard drops its top border to share the signboard's bottom frame; a free-standing row (`top`) keeps all four sides. Bays use flex columns with a pushed-down action row so CTAs align across bays.

Two-column `split` layouts (1fr : 1.25fr, gap clamp(28px, 5vw, 72px)) pair text with a framed photo. The calendar board is 1.6fr : 1fr. The footer is a 1.3fr : 1fr : 1fr grid.

Responsive: at ≤900px bays, splits and features collapse to one column, photo bays get fixed aspect ratios (16/10, tall 3/4), and the nav folds behind a menu button into a full-width list. At ≤560px the signboard stacks seal over name (the small signboard keeps seal beside name). At ≤640px FullCalendar starts in list view, its toolbar stacks, and event tables reflow into stacked rows with date · time inline.

Dashboards: a single centred column, max 1280px, 24px padding and 24px gap between cards (16px at ≤860px); `grid-2` (1fr : 1.2fr) pairs form with list or table with calendar, collapsing at 860px.

## Elevation & Depth

Mostly flat, painted colour. Depth comes from the frame (wood borders reading as a raised mullion) and from the dark wall behind light panes, not from shadow stacks. Three soft, ambient shadows exist, each with a single job, and the dashboards use none at rest.

### Shadow Vocabulary
- **Board hang** (`box-shadow: 0 18px 40px -18px rgba(0,0,0,.6)`): the signboard only, so it reads as hung on the wall.
- **Seal lift** (`filter: drop-shadow(0 6px 10px rgba(0,0,0,.35))`): the seal on the signboard.
- **Button settle** (`box-shadow: 0 6px 14px -8px rgba(15,58,32,.7)`, hover `0 10px 18px -10px rgba(15,58,32,.8)` with a 1px lift): filled buttons.
- **Drawer dim** (`box-shadow: 0 0 0 100vmax rgba(5,20,11,.6)`): the scrim behind the open login drawer.
- **Focus glow** (`box-shadow: 0 0 0 3px rgba(239,196,94,.6)`): focused fields and the event-detail panel.

### Named Rules
**The Frame-Not-Float Rule.** Separate surfaces with wood frames and value contrast; never with card shadows. A pane inside a frame never carries its own shadow.

## Shapes

Square. Every corner is 0: bays, buttons, fields, chips, tabs, FullCalendar buttons, the today cell, dashboard cards and controls. Borders are the language: 12px wood frames for structure, 2–3px solid strokes for controls and active states (2px buttons and fields, 3px nav underline and focus outline), 1px hairlines for dividers. The only off-axis shape is the SAMPLE stamp, rotated −2°, because it is a rubber stamp. Span photos lay two 12px wood mullions over the image at thirds so one photo reads as three panes; posters and lettered signs use the `plain` frame without mullions so their lettering stays intact.

## Components

### Buttons
Painted, square, uppercase, confident.
- **Shape:** square (0), 2px border in the fill colour, 10px gap to an optional 18px stroke arrow icon.
- **Primary:** board green fill, white label (Atkinson 700 .95rem, 0.08em, uppercase), 14px × 22px padding, button-settle shadow.
- **Hover / Active / Focus:** hover fills wall green and lifts 1px (0.2s, ease-out); active returns to 0; focus is the global 3px gold outline at 3px offset. Disabled drops to 55% opacity with a progress cursor.
- **Ghost:** transparent with board border and text, no shadow; hover fills board green with white text. Used for the secondary action in a bay ("Write to the principal") and "Continue as visitor".
- **Gold:** gold fill, ink label, for rare emphasis on the wall.
- **Outline on wall:** the nav's Log in and menu buttons: transparent, 2px on-wall-2 border, on-wall label; hover inverts to on-wall fill with wall text.

### Chips
- **Today chip:** gold fill, ink label (Atkinson 700 .7rem, 0.14em, uppercase), 5px × 8px, top-right of today's event row; the day numeral turns gold-ink.
- **SAMPLE stamp:** transparent, 2px danger border and text (.7rem, 0.16em, uppercase), rotated −2°; on the wall it uses danger-on-wall. Mandatory on any placeholder content.
- **Rail note:** 1px gold border, gold uppercase .8rem text, marks unverified history.
- **Category legend:** 12px square swatch + label, .85rem ink-2.

### Cards / Containers
- **Window bay:** pane background, ink text, padding clamp(20px, 2.4vw, 32px), framed only by the wood grid (no own border, no shadow). Photo bays are full-bleed with a dark gradient caption; poster bays put the caption under the image on the pane so it never covers the poster's lettering.
- **Signboard:** board fill, 12px wood border, board-hang shadow, seal + name grid.
- **Values board:** board fill, 12px wood border, two-column list of lettered values with a 3px translucent gold rule above each.
- **Feature:** framed two-pane grid (text pane + photo) for the one real achievement, with the giant gold-ink placing numeral.

### Inputs / Fields
- **Style:** field-bg surface, 2px field-line border, 0 radius, 12px × 14px padding, inherited 18px body type; bold 0.95rem label above with 6px gap.
- **Hover:** border darkens to ink-2.
- **Focus:** border becomes board green, surface goes white, 3px gold glow; no outline.
- **Error:** border danger; status line below in bold danger (success in board green).

### Navigation
- **Top nav:** sticky, wall background with a 1px translucent pane hairline below, under a 14px wood eave. Seal (40px) + "CESMAIN" mark in Big Shoulders 900 1.5rem on the left. Links are Atkinson 700 .875rem, 0.14em uppercase in on-wall-2 with a 3px transparent bottom border; hover brightens to on-wall; current page is gold text with a gold underline.
- **Mobile (≤900px):** menu button reveals a full-width stacked list, 14px row padding, 1px hairline separators; the current page keeps gold text without the underline.
- **Login drawer:** slides in from the right (min(440px, 100vw)), pane surface with a 12px wood left edge, 0.45s ease-out, dimmed page behind; role tabs are a 3-up segmented control with a 2px board border, active tab filled board green. Escape and the 44px close button dismiss it.

### Calendar board
FullCalendar 5 painted to the board: pane page background, square board-green toolbar buttons (uppercase .8rem) that hover to wall, toolbar title in Big Shoulders 900 1.75rem board green, today's cell washed with gold at 28% and its date number on a solid gold tag. Events take their category colour. Clicking an event opens an inline detail panel (field-bg, 2px board border, focusable) rather than a modal. Beside it, an "All events" table with 2px board header rule and pane-2 row dividers.

### Shutter reveal (signature)
Bays inside a `data-shutters` row that start below 90% of the viewport are closed to a centre slit (`clip-path: inset(0 50% 0 50%)`) and open to full once 15% is visible, over 1.1s on the ease-out curve, staggered 0.12s per bay. It runs once per bay. Without IntersectionObserver or with `prefers-reduced-motion: reduce`, bays render open and nothing animates. Bays already in the first viewport never shut.

### Operate variant (staff dashboards)
The restrained form of the world for principal and teacher pages.
- **Top bar:** 10px wood eave, then a sticky wall-green bar with seal (36px), "CESMAIN" in Big Shoulders 900 22px and a role tag (gold 1px border, gold 12px label). Nav links #d3ddd1, uppercase 14px.
- **Cards:** ops-card surface on ops-bg, 1px ops-line border, 0 radius, 20px padding, header with Big Shoulders 900 30px board-green title and right-aligned controls.
- **Controls:** 1px borders, 8px × 14px buttons (board fill; secondary white with board text; danger white with danger text and border); inputs 1px ops-line, 8px × 10px, focus board border + 3px gold glow. Small buttons 4px × 10px, 13px.
- **Lists:** memos/messages as 1px-bordered white blocks; unread is warm cream (#fffbef / #e7d39a border), urgent gets a red-tinted border. Badges: pane fill + board text; pending cream + amber; urgent pink + danger; counts solid danger.
- **Feedback:** bottom-centre ink toast (danger for errors), fades 0.2s; native `<dialog>` with 45% black backdrop for add/edit.

## Do's and Don'ts

### Do:
- **Do** put every content cluster in window bays: pane cells with a 12px wood frame and 12px wood gap.
- **Do** keep one signboard per page, board green with a 12px wood border, seal left of the lettered name.
- **Do** keep every corner square (0 radius) on both the public site and the dashboards.
- **Do** use gold only for current/today/focus and the painted facts line; use gold-ink when gold must sit on a pane as text.
- **Do** set names, headings, years and values in Big Shoulders Display 900 uppercase, and sentences in Atkinson Hyperlegible at 1.125rem or larger on public pages.
- **Do** mark every placeholder with the rotated SAMPLE stamp until it is replaced with real content.
- **Do** caption posters below the image on the pane, and use plain (mullion-free) frames for posters and lettered signs.
- **Do** honour reduced motion: shutters render open, scroll is not smooth, the drawer does not slide.
- **Do** keep the dashboards light and flat, carrying the world only through the eave, the wall-green bar, Big Shoulders titles and the gold focus glow.

### Don't:
- **Don't** add textures, wood grain images, paint distress or faux wear; the paint is flat colour.
- **Don't** use rounded corners or pill shapes anywhere.
- **Don't** add drop shadows to bays or cards; separation is the frame and the wall behind it.
- **Don't** introduce a second accent colour or use category colours outside the calendar and its legend.
- **Don't** lay mullions over posters or lettered photos, or put captions over a poster's lettering.
- **Don't** fall back to a photo hero with a card grid; the signboard and bays are the first viewport.
- **Don't** put staff controls or the Operate styling on public pages.
