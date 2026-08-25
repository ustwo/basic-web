/**
 * <ui-badge variant="primary" size="md">New</ui-badge>
 * Variants: neutral, primary, secondary, success, warning, danger. Sizes: sm, md.
 * Add the bare attribute "dot" for a leading status dot.
 */
class UIBadge extends HTMLElement {
  static get observedAttributes() { return ["variant", "size", "dot"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const variant = this.getAttribute("variant") || "neutral";
    const size = this.getAttribute("size") || "md";
    const dot = this.hasAttribute("dot");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-flex; }
        span.badge {
          display: inline-flex; align-items: center; gap: var(--spacing-2, 4px);
          border-radius: var(--radius-pill, 9999px);
          font-weight: var(--weight-medium, 500);
          white-space: nowrap;
        }
        .sm { padding: 2px var(--spacing-3); font: var(--label-xs); letter-spacing: var(--tracking-label-xs); }
        .md { padding: var(--spacing-2) var(--spacing-4); font: var(--label-s); letter-spacing: var(--tracking-label-s); }
        i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
        .neutral { background: var(--color-surface-container); color: var(--color-on-surface-variant); }
        .primary { background: var(--color-primary-container); color: var(--color-primary); }
        .secondary { background: var(--color-secondary-container); color: var(--color-secondary); }
        .success { background: var(--color-success-container); color: var(--color-success); }
        .warning { background: var(--color-warning-container); color: var(--color-warning); }
        .danger { background: var(--color-error-container); color: var(--color-error); }
      </style>
      <span class="badge ${variant} ${size}" part="badge">${dot ? "<i></i>" : ""}<slot></slot></span>
    `;
  }
}
customElements.define("ui-badge", UIBadge);
export default UIBadge;
