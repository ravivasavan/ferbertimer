# Design overview

High-level design direction for the Ferber Timer app. Keep this aligned with `docs/figma.md` and `docs/figma-specs.md`; implementation lives in `src/theme.js` and component styles.

## Theme

- **Mode:** Dark-first; light theme supported via `src/theme.js` (Material 3 via React Native Paper).
- **Background:** Deep dark (`#1D1D1D` from Figma). Surfaces slightly lighter (`#1E1E1E`, `#2C2C2C`) for cards and buttons.
- **Accent (from UI):** Bright yellow-green for active state, progress, and key CTAs (e.g. timer ring, “Check-in!”, completed interval). If you use this in Figma, add the hex to `figma-specs.md` and mirror in theme.
- **Text:** Primary white/light gray on dark; secondary text lighter gray. Ensure contrast for accessibility.

## Key screens / states

1. **Idle** – Large circular timer (e.g. 3:00), “Day N · Interval N”, primary Start button, 2×2 grid of interval cards (1st / 2nd / 3rd check, Then).
2. **Running** – Same layout; timer counts down with progress ring; Reset and Skip buttons; one interval card highlighted (current/completed).
3. **Check-in** – “Check-in!” in the circle; “Next interval” as primary action; 1st check marked done (checkmark), others pending (clock icon).
4. **Start over** – Text link + icon at bottom; available in all states.

## Components to keep consistent

- **Timer circle** – Size, stroke width, colors for ring (active vs inactive), inner background.
- **Interval cards** – Background (default vs active), border, icon (check vs clock), label + duration typography.
- **Buttons** – Primary (filled) vs secondary (outline); icon + label; border radius and padding.
- **Typography** – Timer digits, “Day N · Interval N”, button labels, card labels. Prefer a single scale (see `figma-specs.md` when filled).

## Source of truth

- **Figma:** Layout, spacing, and visual hierarchy. Link and frames → `docs/figma.md`.
- **Specs:** Exact colors, type scale, spacing numbers → `docs/figma-specs.md`.
- **Code:** `src/theme.js` for theme tokens; component `StyleSheet`s for layout. When updating UI, prefer tokens from theme and specs from the docs.
