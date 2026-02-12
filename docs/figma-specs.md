# Figma specs

Values extracted from Figma **Dev Mode** / **Inspect** panel. Update this when the design changes.

**Figma file:** [202602 Ferber Timer](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer)

## Key frames (source of truth)

| Screen | Node ID | Link |
|--------|---------|------|
| Ferber Timer/Landing (Idle) | 6602:192 | [Open in Figma](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer?node-id=6602-192&m=dev) |
| Ferber Timer/In Progress (Running) | 6601:3 | [Open in Figma](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer?node-id=6601-3&m=dev) |
| Ferber Timer/Interval Complete (Check-in) | 6602:125 | [Open in Figma](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer?node-id=6602-125&m=dev) |

---

## Container (all screens)

From Figma Inspect → Layer properties:

| Property | Value | Notes |
|----------|-------|-------|
| Width | 393px | Frame width (design target) |
| Height | 852px | Frame height |
| Padding | 24px 23px 24px 24px | top, right, bottom, left |
| Background | `#1D1D1D` | Dark theme screen background |
| Layout | flex, column | flex-direction: column; justify-content: center; align-items: center |
| Content area | 346 × 804 px | Inner area after padding |

---

## Colors

| Token / use | Light | Dark | Notes |
|-------------|-------|------|-------|
| Background | `#F9F9F9` | `#1D1D1D` | Screen background (Figma: #1D1D1D) |
| Surface / cards | `#FFFFFF` | `#1E1E1E` / `#2C2C2C` | Cards, buttons (default) |
| Timer inner circle | — | `#383d26` | Dark greenish-gray inside timer ring |
| Primary text | `#1A1A1A` | `#FFFFFF` / `#E0E0E0` | Headings, timer digits |
| Secondary text | `#4D4D4D` | `#C7C7C7` | "Day N · Interval N", labels |
| Accent / active | `#2E7D32` | `#a4e323` | Progress ring, "Check-in!", active card, bullet |
| Outline / border | `#D6D6D6` | `#4D4D4D` | Buttons, inactive cards |
| Error | `#BA1A1A` | `#F28B82` | Optional |

---

## Typography

| Element | Font family | Weight | Size (px/pt) | Line height | Notes |
|---------|-------------|--------|--------------|-------------|-------|
| Timer digits | System | Bold | 48 | 56 | Main circle; tabular-nums |
| Check-in! (in circle) | System | Bold | 24 | 32 | Accent color when interval complete |
| Day · Interval | System | Medium | 16 | 24 | Subtitle / metadata |
| Button label | System | Medium | 18 | 26 | Start, Reset, Skip, Next interval |
| Card label | System | Normal / Bold when active | 16 | 24 | 1st check, 2nd check, etc. |
| Card duration | System | Bold | 22 | 28 | 3 min, 5 min, etc. |

---

## Spacing

| Token / use | Value (px/pt) | Notes |
|-------------|---------------|-------|
| Screen padding (horizontal) | 24 / 23 | Left 24, Right 23 (from Figma) |
| Screen padding (vertical) | 24 | Top and bottom |
| Gap: timer ↔ metadata | 24 | TimerDisplay marginBottom |
| Gap: metadata ↔ controls | 24 | Between metadata and buttons |
| Gap: controls ↔ interval grid | 12 | Between button row and cards |
| Gap between interval cards | 12 (row) | rowGap 12; 2 columns space-between |
| Button padding (vertical) | 18 | ~56px height |
| Button padding (horizontal) | 24 | Large primary/outline |
| Card padding | 16 | Inside each interval card |
| Gap between primary buttons | 12 | Reset + Skip, Start + Reset |

---

## Components

### Timer circle

| Property | Value | Notes |
|----------|-------|-------|
| Diameter | 220px (Figma) / **346px (app)** | App uses 346px to match edge-to-edge Start button width (content area). |
| Stroke width | 6px | Progress ring |
| Inner circle background | `#383d26` | Dark greenish-gray |
| Progress ring (active) | `#a4e323` | Yellow-green |
| Progress ring (track) | `#333333` | outlineVariant |
| Check-in state | Inner + text in accent | "Check-in!" in #a4e323 |

### Buttons

| Property | Value |
|----------|-------|
| Border radius | 8px |
| Height | 56px |
| Primary (dark): | background #FFFFFF, text #121212 |
| Secondary/outline: | transparent bg, border #4D4D4D, text white |

### Interval cards

| Property | Value |
|----------|-------|
| Border radius | 12px |
| Width | 48% of row (2 columns) |
| Default | bg #1E1E1E / #2C2C2C, border #333333 |
| Active | bg #2C2C2C, border/accent #a4e323 |
| Bullet | Accent circle for active, gray for inactive |

---

## Notes

- Run a quick check that `src/theme.js` and component styles use these values.
- When updating, prefer tokens from theme; keep this doc in sync with Figma Dev Mode.
