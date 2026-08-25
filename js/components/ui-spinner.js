/**
 * <ui-spinner size="24" label="Loading"></ui-spinner>
 * Variants via "variant": primary, current, light.
 */
class UISpinner extends HTMLElement {
  static get observedAttributes() { return ["size", "label", "variant"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const size = Number(this.getAttribute("size") || 24);
    const label = this.getAttribute("label") || "Loading";
    const variant = this.getAttribute("variant") || "primary";
    const colour = variant === "current" ? "currentColor" : variant === "light" ? "var(--color-surface-container)" : "var(--color-primary)";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-flex; align-items: center; gap: var(--spacing-3, 8px); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ring {
          width: ${size}px; height: ${size}px; flex: none;
          border-radius: 50%;
          border: ${Math.max(2, Math.round(size / 10))}px solid var(--color-surface-container-highest);
          border-top-color: ${colour};
          animation: spin var(--duration-slow, 700ms) linear infinite;
        }
        span { font: var(--body-s); color: var(--color-on-surface-variant); }
      </style>
      <span class="ring" role="status" aria-label="${label}" part="ring"></span>
      ${label ? `<span>${label}</span>` : ""}
    `;
  }
}
customElements.define("ui-spinner", UISpinner);
export default UISpinner;
