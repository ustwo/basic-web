/**
 * <ui-icon-button label="Close" variant="light" size="md">×</ui-icon-button>
 * A square button for a single glyph or SVG. "label" becomes the accessible name.
 * Variants: primary, light, ghost, danger. Sizes: sm, md, lg.
 */
class UIIconButton extends HTMLElement {
  static get observedAttributes() { return ["label", "variant", "size", "disabled"]; }

  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const label = this.getAttribute("label") || "";
    const variant = this.getAttribute("variant") || "light";
    const size = this.getAttribute("size") || "md";
    const disabled = this.hasAttribute("disabled");

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-flex; }
        button {
          display: inline-flex; align-items: center; justify-content: center;
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-md, 10px);
          cursor: pointer; padding: 0;
          font: inherit; line-height: 1;
          transition: background var(--duration-fast, 120ms) var(--ease-standard),
                      box-shadow var(--duration-fast, 120ms) var(--ease-standard),
                      transform var(--duration-fast, 120ms) var(--ease-standard);
        }
        button:active:not(:disabled) { transform: scale(0.94); }
        button:focus-visible { outline: none; box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        button:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
        .sm { width: 32px; height: 32px; font-size: 0.875rem; }
        .md { width: 40px; height: 40px; font-size: 1rem; }
        .lg { width: 48px; height: 48px; font-size: 1.125rem; }
        .primary { background: var(--color-primary); color: var(--color-on-primary); }
        .primary:hover:not(:disabled) { background: var(--color-primary-hover); }
        .light { background: var(--color-surface-container); color: var(--color-on-surface); }
        .light:hover:not(:disabled) { background: var(--color-surface-container-hover); }
        .ghost { background: transparent; color: var(--color-on-surface-variant); }
        .ghost:hover:not(:disabled) { background: var(--color-surface-container-hover); color: var(--color-on-surface); }
        .danger { background: var(--color-error-container); color: var(--color-error); }
        .danger:hover:not(:disabled) { background: var(--color-error); color: var(--color-on-error); }
      </style>
      <button class="${variant} ${size}" type="button" aria-label="${label}" ${disabled ? "disabled" : ""} part="button">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ui-icon-button", UIIconButton);
export default UIIconButton;
