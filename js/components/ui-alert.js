/**
 * <ui-alert variant="info|success|warning|danger" dismissible>Message</ui-alert>
 * Fires a "dismiss" event and removes itself when the close button is clicked.
 */
class UIAlert extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "dismissible"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    // Delegated on shadowRoot so it survives render() replacing the shadow
    // DOM's children on every attribute change.
    this.shadowRoot.addEventListener("click", (e) => {
      if (!e.target.closest("[data-dismiss]")) return;
      this.dispatchEvent(new CustomEvent("dismiss", { bubbles: true, composed: true }));
      this.remove();
    });
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const variant = this.getAttribute("variant") || "info";
    const dismissible = this.hasAttribute("dismissible");
    const accent = variant === "info" ? "primary" : variant;

    this.shadowRoot.innerHTML = `
      <style>
        .alert {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-2, 0.5rem);
          padding: var(--spacing-3, 1rem);
          border-radius: var(--radius, 6px);
          background: var(--color-bg-alt);
          border-left: 4px solid var(--color-${accent});
          color: var(--color-text);
          font-family: var(--font-family, inherit);
        }
        .message {
          flex: 1;
        }
        button {
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
          font: inherit;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
        }
        button:focus-visible {
          outline: 2px solid var(--color-focus);
          outline-offset: 2px;
        }
      </style>
      <div class="alert" role="alert">
        <div class="message"><slot></slot></div>
        ${dismissible ? `<button type="button" data-dismiss aria-label="Dismiss">&times;</button>` : ""}
      </div>
    `;
  }
}

customElements.define("ui-alert", UIAlert);
