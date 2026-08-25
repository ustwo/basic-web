/**
 * <ui-tooltip text="More information" position="top"><ui-button>Hover me</ui-button></ui-tooltip>
 * Wraps its slotted content and shows the tooltip on hover or focus.
 * Positions: top, bottom, left, right.
 */
const PLACEMENTS = {
  top: "bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px;",
  bottom: "top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px;",
  left: "right: 100%; top: 50%; transform: translateY(-50%); margin-right: 8px;",
  right: "left: 100%; top: 50%; transform: translateY(-50%); margin-left: 8px;"
};

class UITooltip extends HTMLElement {
  static get observedAttributes() { return ["text", "position"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const text = this.getAttribute("text") || "";
    const position = this.getAttribute("position") || "top";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-block; }
        .wrap { position: relative; display: inline-flex; }
        .tip {
          position: absolute; ${PLACEMENTS[position] || PLACEMENTS.top}
          z-index: var(--z-tooltip, 1500);
          padding: var(--spacing-2, 4px) var(--spacing-4, 12px);
          background: var(--color-inverse-surface); color: var(--color-surface-container);
          border-radius: var(--radius-sm, 6px);
          box-shadow: var(--elevation-2);
          font: var(--body-s);
          white-space: nowrap; pointer-events: none;
          opacity: 0; transform-origin: center;
          transition: opacity var(--duration-fast, 120ms) var(--ease-out);
        }
        .wrap:hover .tip, .wrap:focus-within .tip { opacity: 1; }
      </style>
      <span class="wrap">
        <slot></slot>
        <span class="tip" role="tooltip" part="tip">${text}</span>
      </span>
    `;
  }
}
customElements.define("ui-tooltip", UITooltip);
export default UITooltip;
