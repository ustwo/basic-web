/**
 * <ui-button variant="primary" size="md">Save changes</ui-button>
 * Variants: primary, secondary, success, warning, danger, ghost, light.
 * Sizes: sm, md, lg. Add the bare attribute "disabled" or "full" as needed.
 * Fires a native "click" event (composed, so it bubbles out of the shadow root).
 */
class UIButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "disabled", "full", "type"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const variant = this.getAttribute("variant") || "primary";
    const size = this.getAttribute("size") || "md";
    const disabled = this.hasAttribute("disabled");
    const type = this.getAttribute("type") || "button";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-flex; }
        :host([full]) { display: flex; }
        button {
          display: inline-flex; align-items: center; justify-content: center;
          gap: var(--spacing-3, 8px);
          width: 100%;
          font: var(--label-l);
          letter-spacing: var(--tracking-label-l);
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-md, 10px);
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--duration-fast, 120ms) var(--ease-standard),
                      color var(--duration-fast, 120ms) var(--ease-standard),
                      box-shadow var(--duration-fast, 120ms) var(--ease-standard),
                      transform var(--duration-fast, 120ms) var(--ease-standard);
        }
        button:active:not(:disabled) { transform: scale(0.97); }
        button:focus-visible { outline: none; box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        button:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }

        .sm { padding: var(--spacing-2) var(--spacing-4); min-height: 32px; font: var(--label-s); letter-spacing: var(--tracking-label-s); }
        .md { padding: var(--spacing-3) var(--spacing-5); min-height: 40px; font: var(--label-m); letter-spacing: var(--tracking-label-m); }
        .lg { padding: var(--spacing-4) var(--spacing-7); min-height: 48px; font: var(--label-l); letter-spacing: var(--tracking-label-l); }

        .primary { background: var(--color-primary); color: var(--color-on-primary); }
        .primary:hover:not(:disabled) { background: var(--color-primary-hover); }
        .primary:active:not(:disabled) { background: var(--color-primary-pressed); }
        .secondary { background: var(--color-secondary); color: var(--color-on-secondary); }
        .secondary:hover:not(:disabled) { background: color-mix(in srgb, var(--color-secondary) 88%, #000); }
        .success { background: var(--color-success); color: var(--color-on-success); }
        .warning { background: var(--color-warning); color: var(--color-on-warning); }
        .danger { background: var(--color-error); color: var(--color-on-error); }
        .success:hover:not(:disabled) { background: color-mix(in srgb, var(--color-success) 88%, #000); }
        .warning:hover:not(:disabled) { background: color-mix(in srgb, var(--color-warning) 88%, #000); }
        .danger:hover:not(:disabled) { background: var(--color-error-hover); }
        .danger:active:not(:disabled) { background: var(--color-error-pressed); }
        .ghost { background: transparent; color: var(--color-primary); border-color: var(--color-outline); }
        .ghost:hover:not(:disabled) { background: var(--color-primary-container-hover); border-color: var(--color-primary); }
        .light { background: var(--color-surface-container); color: var(--color-on-surface); }
        .light:hover:not(:disabled) { background: var(--color-surface-container-hover); }
        .light:active:not(:disabled) { background: var(--color-surface-container-pressed); }
      </style>
      <button class="${variant} ${size}" type="${type}" ${disabled ? "disabled" : ""} part="button">
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ui-button", UIButton);
export default UIButton;
