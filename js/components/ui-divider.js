/**
 * <ui-divider label="or"></ui-divider>
 * A horizontal rule, optionally with a centred label. Add "vertical" for a column rule.
 */
class UIDivider extends HTMLElement {
  static get observedAttributes() { return ["label", "vertical"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const label = this.getAttribute("label") || "";
    const vertical = this.hasAttribute("vertical");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .h { display: flex; align-items: center; gap: var(--spacing-4, 12px); }
        .h::before, .h::after { content: ""; flex: 1; height: var(--border-thin, 1px); background: var(--color-outline-variant); }
        .h.bare::after { display: none; }
        .h.bare::before { flex: 1; }
        span { font: var(--body-s); color: var(--color-on-surface-muted); white-space: nowrap; }
        .v { width: var(--border-thin, 1px); height: 100%; min-height: 20px; background: var(--color-outline-variant); }
        :host([vertical]) { display: inline-block; height: 100%; }
      </style>
      ${vertical ? '<div class="v" part="rule"></div>'
        : `<div class="h ${label ? "" : "bare"}" part="rule">${label ? `<span>${label}</span>` : ""}</div>`}
    `;
  }
}
customElements.define("ui-divider", UIDivider);
export default UIDivider;
