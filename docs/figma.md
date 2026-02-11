# Figma – Design source

Use this doc to keep the codebase aligned with Figma. Update the link and frame list when the file changes.

## Figma file

- **Link:** https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer
- **Last synced:** 2026-02-11

## Key frames / screens

| Screen / state | Node ID | Description |
|----------------|---------|-------------|
| Ferber Timer/Landing | 6602:192 | [Open](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer?node-id=6602-192&m=dev) — Idle: 3:00, Day 1 · Interval 1, Start button, interval cards |
| Ferber Timer/In Progress | 6601:3 | [Open](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer?node-id=6601-3&m=dev) — Running: 2:45 countdown, Reset + Skip, interval cards |
| Ferber Timer/Interval Complete | 6602:125 | [Open](https://www.figma.com/design/pvmn9ArXw7DFkkBr4VaPar/202602-Ferber-Timer?node-id=6602-125&m=dev) — Check-in: "Check-in!" in circle, Next interval, 1st check done |

## How to use with Cursor

1. **For layout or visual changes:** Open the frame in Figma Dev Mode, copy values from Inspect into `docs/figma-specs.md`, then update components.
2. **For precise specs:** Copy colors, spacing, typography from Figma Inspect → `figma-specs.md` → `src/theme.js` and component styles.
3. **Design tokens:** Keep `docs/design.md`, `docs/figma-specs.md`, and `src/theme.js` in sync.

## Notes

- The project rule in `.cursor/rules/` tells the AI to prefer these docs and Figma when making UI changes.
