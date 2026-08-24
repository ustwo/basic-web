/**
 * <ui-card>
 *   <span slot="header">Title</span>
 *   Body content
 *   <span slot="footer">Footer</span>
 * </ui-card>
 */
class UICard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2, 0.5rem);
          border: 1px solid var(--color-border);
          border-radius: var(--radius, 6px);
          background: var(--color-bg);
          padding: var(--spacing-3, 1rem);
          font-family: var(--font-family, inherit);
        }
        ::slotted([slot="header"]) {
          font-weight: 600;
          color: var(--color-text);
        }
        ::slotted([slot="footer"]) {
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }
      </style>
      <div class="card">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

customElements.define("ui-card", UICard);
