async function applyColorTokens() {
  let tokens;
  try {
    tokens = await (await fetch("tokens/colors.json")).json();
  } catch {
    // tokens/colors.json is the only source of color values — if it's
    // unreachable, colors are left unset rather than silently faked.
    return;
  }
  for (const [name, value] of Object.entries(tokens.color || {})) {
    document.documentElement.style.setProperty(`--color-${name}`, value);
  }
}

applyColorTokens();
