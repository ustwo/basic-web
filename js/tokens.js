// Maps tokens/tokens.json's color.hex keys to this project's --color-*
// custom property names, so the token source's naming can differ freely
// from the CSS/component-facing names.
const COLOR_TOKEN_MAP = {
  colorBg: "bg",
  colorBgAlt: "bg-alt",
  colorText: "text",
  colorTextMuted: "text-muted",
  colorPrimary: "primary",
  colorBorder: "border",
  colorFocus: "focus",
  colorScrim: "scrim",
  colorWarning: "warning",
  colorCritical: "danger",
};

// tokens/tokens.json has no entry for these yet — derived/stopgap values
// until the design source defines colorPrimaryHover and colorSuccess.
const FALLBACK_SUCCESS = "#1a7f37";
const PRIMARY_HOVER_DARKEN = 0.15;

function darken(hex, amount) {
  const n = parseInt(hex.replace("#", ""), 16);
  const channel = (shift) => Math.round(((n >> shift) & 0xff) * (1 - amount));
  return `#${[16, 8, 0].map((s) => channel(s).toString(16).padStart(2, "0")).join("")}`;
}

async function applyColorTokens() {
  let tokens;
  try {
    tokens = await (await fetch("tokens/tokens.json")).json();
  } catch {
    // tokens/tokens.json is the only source of color values — if it's
    // unreachable, colors are left unset rather than silently faked.
    return;
  }
  const hex = tokens.color?.hex || {};
  const root = document.documentElement.style;

  for (const [key, cssName] of Object.entries(COLOR_TOKEN_MAP)) {
    if (key in hex) root.setProperty(`--color-${cssName}`, hex[key]);
  }
  if (hex.colorPrimary) {
    root.setProperty("--color-primary-hover", darken(hex.colorPrimary, PRIMARY_HOVER_DARKEN));
  }
  root.setProperty("--color-success", FALLBACK_SUCCESS);
}

applyColorTokens();
