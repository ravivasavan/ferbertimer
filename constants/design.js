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

// Spacing: timer top (clear dynamic island), timer ↔ metadata 24, metadata ↔ controls 24, controls ↔ grid 12
export const FIGMA_SPACING = {
  timerTopMargin: 56,
  timerToMetadata: 24,
  metadataToControls: 24,
  controlsToGrid: 12,
  startOverMarginTop: 16,
  startOverMarginHorizontal: 0, // Full width footprint (Figma)
  startOverMarginBottom: 24,
};
