/**
 * <ui-button variant="primary|secondary" disabled type="button|submit">Label</ui-button>
 * Fires a native "click" event (composed, so it bubbles out of the shadow root).
 */
class UIButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute("variant") || "primary";
    const disabled = this.hasAttribute("disabled");
    const type = this.getAttribute("type") || "button";

    this.shadowRoot.innerHTML = `
      <style>
        button {
          font: inherit;
          font-weight: 600;
          padding: var(--spacing-2, 0.5rem) var(--spacing-3, 1rem);
          border-radius: var(--radius, 6px);
          border: 1px solid transparent;
          cursor: pointer;
        }
        button:focus-visible {
          outline: 2px solid var(--color-focus);
          outline-offset: 2px;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .primary {
          background: var(--color-primary);
          color: var(--color-bg);
        }
        .primary:hover:not(:disabled) {
          background: var(--color-primary-hover);
        }
        .secondary {
          background: transparent;
          color: var(--color-text);
          border-color: var(--color-border);
        }
        .secondary:hover:not(:disabled) {
          background: var(--color-bg-alt);
        }
      </style>
      <button class="${variant}" type="${type}" ${disabled ? "disabled" : ""}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ui-button", UIButton);
