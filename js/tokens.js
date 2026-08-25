/**
 * Reads tokens/tokens.json and applies every group as CSS custom properties on :root.
 *
 * The export's key naming is whatever the design tool produced (camelCase, grouped by
 * type). The tables below translate that into the CSS names the components read, so
 * neither side has to rename to match the other.
 *
 * Light mode only. The source system publishes light and dark, but this project has no
 * mode-switching logic, so carrying both would mean writing one set of properties and
 * leaving the other unreachable.
 */

const COLOR_TOKEN_MAP = {
  // Interactive
  colorPrimary: "primary",
  colorOnPrimary: "on-primary",
  colorPrimaryContainer: "primary-container",
  colorOnPrimaryContainer: "on-primary-container",
  colorSecondary: "secondary",
  colorOnSecondary: "on-secondary",
  colorSecondaryContainer: "secondary-container",
  colorOnSecondaryContainer: "on-secondary-container",
  colorTertiary: "tertiary",
  colorOnTertiary: "on-tertiary",
  colorTertiaryContainer: "tertiary-container",
  colorOnTertiaryContainer: "on-tertiary-container",
  colorFocus: "focus",
  colorOnFocus: "on-focus",
  colorFocusContainer: "focus-container",
  colorOnFocusContainer: "on-focus-container",

  // Semantic
  colorError: "error",
  colorOnError: "on-error",
  colorErrorContainer: "error-container",
  colorOnErrorContainer: "on-error-container",
  colorWarning: "warning",
  colorOnWarning: "on-warning",
  colorWarningContainer: "warning-container",
  colorOnWarningContainer: "on-warning-container",
  colorSuccess: "success",
  colorOnSuccess: "on-success",
  colorSuccessContainer: "success-container",
  colorOnSuccessContainer: "on-success-container",

  // Surface
  colorSurface: "surface",
  colorSurfaceBlurHigh: "surface-blur-high",
  colorSurfaceBlur: "surface-blur",
  colorSurfaceBlurLow: "surface-blur-low",
  colorSurfaceContainer: "surface-container",
  colorSurfaceContainerHighest: "surface-container-highest",
  colorSurfaceDisabled: "surface-disabled",
  colorInverseSurface: "inverse-surface",

  // Text
  colorOnSurface: "on-surface",
  colorOnSurfaceVariant: "on-surface-variant",
  colorOnSurfaceMuted: "on-surface-muted",
  colorOnSurfaceDisabled: "on-surface-disabled",
  colorInverseOnSurface: "inverse-on-surface",

  // Overlays and outline
  colorScrim: "scrim",
  colorScrimHeavy: "scrim-heavy",
  colorBackgroundBlurScrim: "background-blur-scrim",
  colorOutline: "outline",
  colorOutlineVariant: "outline-variant",
  colorOutlineInverse: "outline-inverse",

  // State overlays, pre-composited over their base colour
  colorPrimaryHover: "primary-hover",
  colorPrimaryPressed: "primary-pressed",
  colorPrimaryContainerHover: "primary-container-hover",
  colorPrimaryContainerPressed: "primary-container-pressed",
  colorErrorHover: "error-hover",
  colorErrorPressed: "error-pressed",
  colorSurfaceContainerHover: "surface-container-hover",
  colorSurfaceContainerPressed: "surface-container-pressed",
  colorStateHover: "state-hover",
  colorStatePressed: "state-pressed"
};

const TYPE_TOKEN_MAP = {
  fontFamilyBase: "font-family-base", fontFamilyMono: "font-family-mono",
  displayXl: "display-xl", displayL: "display-l", displayM: "display-m",
  displayS: "display-s", displayXs: "display-xs",
  headlineL: "headline-l", headlineM: "headline-m", headlineS: "headline-s",
  titleXl: "title-xl", titleL: "title-l", titleM: "title-m", titleS: "title-s", titleXs: "title-xs",
  labelL: "label-l", labelM: "label-m", labelS: "label-s", labelXs: "label-xs",
  bodyL: "body-l", bodyLMedium: "body-l-medium", bodyLBold: "body-l-bold",
  bodyM: "body-m", bodyMMedium: "body-m-medium", bodyMBold: "body-m-bold",
  bodyS: "body-s", bodySMedium: "body-s-medium", bodySBold: "body-s-bold",
  bodyXs: "body-xs",
  trackingDisplay: "tracking-display", trackingHeadlineL: "tracking-headline-l",
  trackingTitleM: "tracking-title-m", trackingTitleS: "tracking-title-s",
  trackingLabelL: "tracking-label-l", trackingLabelM: "tracking-label-m",
  trackingLabelS: "tracking-label-s", trackingLabelXs: "tracking-label-xs",
  trackingBodyL: "tracking-body-l", trackingBodyM: "tracking-body-m",
  trackingBodyS: "tracking-body-s",
  weightRegular: "weight-regular", weightMedium: "weight-medium", weightBold: "weight-bold"
};

// group path in the JSON -> [ CSS prefix, unit for a bare number, key->name table ]
const GROUPS = [
  ["color.hex", ["--color-", "", COLOR_TOKEN_MAP]],
  ["typography.font", ["--", "", TYPE_TOKEN_MAP]],
  ["shadow.css", ["--", "", {
    elevation1: "elevation-1", elevation2: "elevation-2", elevation3: "elevation-3",
    elevation4: "elevation-4", elevation5: "elevation-5",
    elevationBottom: "elevation-bottom", shadowFocus: "shadow-focus"
  }]],
  ["blur.pX", ["--blur-", "px", { blurWindow: "window", blurPromptBar: "prompt-bar", blurSurface: "surface" }]],
  ["spacing.pX", ["--spacing-", "px", {
    spacing0: "0", spacing1: "1", spacing2: "2", spacing3: "3", spacing4: "4",
    spacing5: "5", spacing6: "6", spacing7: "7", spacing8: "8", spacing9: "9", spacing10: "10"
  }]],
  ["radius.pX", ["--radius-", "px", {
    radiusSm: "sm", radiusMd: "md", radiusLg: "lg", radiusXl: "xl", radiusPill: "pill"
  }]],
  ["motion.css", ["--", "", {
    durationFast: "duration-fast", durationBase: "duration-base", durationSlow: "duration-slow",
    easeStandard: "ease-standard", easeOut: "ease-out", easeSpring: "ease-spring"
  }]],
  ["zIndex.n", ["--z-", "", {
    zBase: "base", zRaised: "raised", zSticky: "sticky", zDropdown: "dropdown",
    zOverlay: "overlay", zModal: "modal", zToast: "toast", zTooltip: "tooltip"
  }]],
  ["borderWidth.pX", ["--border-", "px", { borderThin: "thin", borderMedium: "medium", borderThick: "thick" }]],
  ["opacity.n", ["--opacity-", "", { opacityDisabled: "disabled", opacitySubtle: "subtle", opacityMuted: "muted", opacityFull: "full" }]]
];

// Names the components already read, pointed at their equivalent in the new system.
// Keeping these means a token rename upstream is a one-line change here rather than a
// find-and-replace through 28 component files — and any component still on an old name
// re-themes correctly instead of silently falling back.
const ALIASES = {
  "--color-bg": "--color-surface",
  "--color-bg-alt": "--color-surface-container",
  "--color-surface-raised": "--color-surface",
  "--color-text": "--color-on-surface",
  "--color-text-muted": "--color-on-surface-variant",
  "--color-text-subtle": "--color-on-surface-muted",
  "--color-primary-soft": "--color-primary-container",
  "--color-secondary-soft": "--color-secondary-container",
  "--color-success-soft": "--color-success-container",
  "--color-warning-soft": "--color-warning-container",
  "--color-danger": "--color-error",
  "--color-neutral-alpha-hover": "--color-state-hover",
  "--color-on-danger": "--color-on-error",
  "--color-danger-soft": "--color-error-container",
  "--color-border": "--color-outline-variant",
  "--color-border-strong": "--color-outline",
  "--color-neutral-50": "--color-surface-container",
  "--color-neutral-100": "--color-surface-container",
  "--color-neutral-200": "--color-surface-container-highest",
  "--color-neutral-300": "--color-outline-variant",
  "--color-neutral-400": "--color-on-surface-muted",
  "--color-neutral-500": "--color-on-surface-muted",
  "--color-neutral-600": "--color-on-surface-variant",
  "--color-neutral-700": "--color-on-surface-variant",
  "--color-neutral-800": "--color-inverse-surface",
  "--color-neutral-900": "--color-inverse-surface",
  "--shadow-sm": "--elevation-1",
  "--shadow-md": "--elevation-2",
  "--shadow-lg": "--elevation-3",
  "--shadow-xl": "--elevation-5",
  "--text-xs": "--body-xs",
  "--text-sm": "--body-m",
  "--text-base": "--body-l",
  "--text-lg": "--title-m",
  "--text-title": "--title-xl",
  "--text-display": "--headline-m"
};

function at(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

export async function applyTokens(url = "tokens/tokens.json") {
  const res = await fetch(url);
  if (!res.ok) throw new Error("could not read " + url + " (HTTP " + res.status + ")");
  const data = await res.json();
  const root = document.documentElement;
  let applied = 0;

  for (const [path, [prefix, unit, map]] of GROUPS) {
    const group = at(data, path);
    if (!group) continue;
    for (const key of Object.keys(group)) {
      const name = map[key];
      // No mapping means the export carries a token this project does not use. Skip it
      // rather than invent a CSS name for it.
      if (!name) continue;
      const raw = group[key];
      const value = typeof raw === "number" && unit ? raw + unit : String(raw);
      root.style.setProperty(prefix + name, value);
      applied++;
    }
  }

  for (const [from, to] of Object.entries(ALIASES)) {
    root.style.setProperty(from, "var(" + to + ")");
    applied++;
  }

  return applied;
}

// Exported, not fire-and-forget. applyTokens does a fetch, so anything that reads a
// custom property — a component's first paint, or a page reading getComputedStyle —
// has to be able to wait for it. Importing this module for its side effect only
// establishes no ordering at all.
export const tokensReady = applyTokens().catch(err => {
  console.error("[tokens] " + err.message);
  return 0;
});
