/**
 * Registers every component and wires the demo page.
 *
 * The token promise is AWAITED before any component is imported. A bare import would
 * not do it: applyTokens fetches tokens.json, so an element that upgraded first would
 * paint its opening frame on var() fallbacks, and anything reading getComputedStyle
 * would read an empty string.
 */

import { tokensReady } from "./tokens.js";

await tokensReady;

const COMPONENTS = [
  "ui-button", "ui-icon-button", "ui-textfield", "ui-search-field", "ui-textarea",
  "ui-checkbox", "ui-toggle", "ui-radio", "ui-select", "ui-slider",
  "ui-badge", "ui-chip", "ui-avatar", "ui-card", "ui-divider",
  "ui-alert", "ui-toast", "ui-tooltip", "ui-spinner", "ui-progress",
  "ui-skeleton", "ui-empty-state", "ui-tabs", "ui-accordion", "ui-dropdown",
  "ui-modal", "ui-table", "ui-pagination"
];

await Promise.all(COMPONENTS.map(name => import(`./components/${name}.js`)));

// ---- demo page wiring ----

const out = document.querySelector("#event-log");
function logEvent(text) {
  if (!out) return;
  const line = document.createElement("div");
  line.textContent = text;
  out.prepend(line);
  while (out.children.length > 6) out.lastChild.remove();
}

["input", "change", "select", "search", "toggle", "rowclick", "remove", "dismiss"].forEach(type => {
  document.addEventListener(type, e => {
    if (!e.detail || !e.target.tagName || !e.target.tagName.startsWith("UI-")) return;
    const d = e.detail;
    const value = d.value !== undefined ? d.value
      : d.checked !== undefined ? d.checked
      : d.page !== undefined ? d.page
      : d.index !== undefined ? d.index
      : d.open !== undefined ? d.open
      : d.query !== undefined ? d.query : "";
    logEvent(`${e.target.tagName.toLowerCase()} ${type}: ${value}`);
  });
});

const modal = document.querySelector("#demo-modal");
const openModal = document.querySelector("#open-modal");
if (modal && openModal) {
  openModal.addEventListener("click", () => modal.setAttribute("open", ""));
  document.querySelectorAll("[data-close-modal]").forEach(b =>
    b.addEventListener("click", () => modal.removeAttribute("open")));
}

const toastBtn = document.querySelector("#fire-toast");
if (toastBtn) {
  toastBtn.addEventListener("click", () => {
    const t = document.createElement("ui-toast");
    t.setAttribute("variant", "success");
    t.setAttribute("message", "Saved successfully");
    document.body.appendChild(t);
  });
}

// Both specimens read the applied custom properties, so neither can drift from what
// the components themselves resolve.
const style = getComputedStyle(document.documentElement);

const swatchHost = document.querySelector("#swatches");
if (swatchHost) {
  const names = [
    "primary", "on-primary", "primary-container", "secondary", "tertiary",
    "error", "warning", "success", "focus",
    "surface", "surface-container", "surface-container-highest", "inverse-surface",
    "on-surface", "on-surface-variant", "on-surface-muted",
    "outline", "outline-variant", "scrim", "surface-blur"
  ];
  swatchHost.innerHTML = names.map(n => {
    const value = style.getPropertyValue("--color-" + n).trim() || "(unset)";
    return `<div class="swatch"><i style="background: ${value}"></i><b>--color-${n}</b><span>${value}</span></div>`;
  }).join("");
}

const typeHost = document.querySelector("#type-scale");
if (typeHost) {
  const styles = [
    ["display-xs", "Display XS"], ["headline-l", "Headline L"], ["headline-m", "Headline M"],
    ["headline-s", "Headline S"], ["title-xl", "Title XL"], ["title-l", "Title L"],
    ["title-m", "Title M"], ["label-l", "Label L"], ["label-m", "Label M"],
    ["body-l", "Body L"], ["body-m", "Body M"], ["body-s", "Body S"]
  ];
  typeHost.innerHTML = styles.map(([token, label]) => {
    const value = style.getPropertyValue("--" + token).trim();
    return `<div class="type-row"><span style="font: ${value}">${label}</span><span>--${token}</span></div>`;
  }).join("");
}
