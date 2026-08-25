/**
 * <ui-progress value="60" max="100" label="Uploading"></ui-progress>
 * Variants via "variant": primary, success, warning, danger.
 * Add "indeterminate" for an unknown-duration bar.
 */
class UIProgress extends HTMLElement {
  static get observedAttributes() { return ["value", "max", "label", "variant", "indeterminate"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const value = Number(this.getAttribute("value") || 0);
    const max = Number(this.getAttribute("max") || 100);
    const label = this.getAttribute("label") || "";
    const variant = this.getAttribute("variant") || "primary";
    const indeterminate = this.hasAttribute("indeterminate");
    const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .top { display: flex; align-items: baseline; justify-content: space-between; gap: var(--spacing-4, 12px); margin-bottom: var(--spacing-3, 8px); }
        label { font: var(--label-m); letter-spacing: var(--tracking-label-m); }
        output { font: var(--body-s); font-family: var(--font-family-mono); color: var(--color-on-surface-variant); }
        .track { height: 8px; border-radius: var(--radius-pill, 9999px); background: var(--color-surface-container-highest); overflow: hidden; }
        .fill {
          height: 100%; border-radius: inherit;
          transition: width var(--duration-base, 200ms) var(--ease-out);
        }
        .primary { background: var(--color-primary); }
        .success { background: var(--color-success); }
        .warning { background: var(--color-warning); }
        .danger { background: var(--color-error); }
        @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
        .indet { width: 33%; animation: slide 1.2s var(--ease-standard) infinite; }
      </style>
      ${label ? `<div class="top"><label>${label}</label><output>${indeterminate ? "" : Math.round(pct) + "%"}</output></div>` : ""}
      <div class="track" role="progressbar" ${indeterminate ? "" : `aria-valuenow="${value}" aria-valuemax="${max}"`} part="track">
        <div class="fill ${variant} ${indeterminate ? "indet" : ""}" style="width: ${indeterminate ? "33%" : pct + "%"}"></div>
      </div>
    `;
  }
}
customElements.define("ui-progress", UIProgress);
export default UIProgress;
