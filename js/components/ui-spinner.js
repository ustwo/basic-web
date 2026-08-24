/**
 * <ui-spinner size="24" label="Loading"></ui-spinner>
 */
class UISpinner extends HTMLElement {
  static get observedAttributes() {
    return ["size", "label"];
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
    const size = this.getAttribute("size") || "24";
    const label = this.getAttribute("label") || "Loading";

    this.shadowRoot.innerHTML = `
      <style>
        .spinner {
          width: ${size}px;
          height: ${size}px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      </style>
      <div class="spinner" role="status" aria-label="${label}"></div>
    `;
  }
}

customElements.define("ui-spinner", UISpinner);
