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
          outline: 2px solid var(--color-focus, #2f6fed);
          outline-offset: 2px;
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .primary {
          background: var(--color-primary, #2f6fed);
          color: #fff;
        }
        .primary:hover:not(:disabled) {
          background: var(--color-primary-hover, #2559c7);
        }
        .secondary {
          background: transparent;
          color: var(--color-text, #1a1d21);
          border-color: var(--color-border, #d7dbe0);
        }
        .secondary:hover:not(:disabled) {
          background: var(--color-bg-alt, #f5f6f8);
        }
      </style>
      <button class="${variant}" type="${type}" ${disabled ? "disabled" : ""}>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define("ui-button", UIButton);
