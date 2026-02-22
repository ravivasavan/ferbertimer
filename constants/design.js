// Figma design tokens (from docs/figma-specs.md)
// Frame: 393×852px, padding top 24, right 23, bottom 24, left 24

export const FIGMA_FRAME = {
  width: 393,
  height: 852,
  paddingTop: 24,
  paddingRight: 23,
  paddingBottom: 24,
  paddingLeft: 24,
  paddingVertical: 24,
  // Extra top inset to clear physical notch / dynamic island (in addition to safe area)
  topInsetNotch: 20,
};

export const FIGMA_TIMER = {
  diameter: 346, // Match content width (edge-to-edge with Start button)
  strokeWidth: 12,
};

export const FIGMA_BUTTON = {
  height: 56,
  borderRadius: 8,
  paddingVertical: 18,
  paddingHorizontal: 24,
};

export const FIGMA_CARD = {
  borderRadius: 12,
  padding: 16,
  widthPercent: 0.48,
  rowGap: 12,
  gapBetweenButtons: 12,
};

// Spacing: 36px between day nav ↔ timer ↔ controls; 12px between controls ↔ grid
export const FIGMA_SPACING = {
  sectionGap: 36,
  timerTopMargin: 36,
  timerToControls: 36,
  controlsToGrid: 12,
};
