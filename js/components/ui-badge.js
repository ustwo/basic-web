/**
 * <ui-badge variant="neutral|primary|success|warning|danger">Label</ui-badge>
 */
class UIBadge extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
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
    const variant = this.getAttribute("variant") || "neutral";

    this.shadowRoot.innerHTML = `
      <style>
        span {
          display: inline-flex;
          align-items: center;
          font: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem var(--spacing-2, 0.5rem);
          border-radius: 999px;
        }
        .neutral {
          background: var(--color-bg-alt);
          color: var(--color-text-muted);
        }
        .primary {
          background: var(--color-primary);
          color: var(--color-bg);
        }
        .success {
          background: var(--color-success);
          color: var(--color-bg);
        }
        .warning {
          background: var(--color-warning);
          color: var(--color-bg);
        }
        .danger {
          background: var(--color-danger);
          color: var(--color-bg);
        }
      </style>
      <span class="${variant}"><slot></slot></span>
    `;
  }
}

customElements.define("ui-badge", UIBadge);
