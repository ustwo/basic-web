/**
 * <ui-textfield label="Name" placeholder="..." type="text" value="..."></ui-textfield>
 * Fires an "input" event with detail: { value }.
 */
class UITextfield extends HTMLElement {
  static get observedAttributes() {
    return ["label", "placeholder", "type", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._id = `ui-textfield-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("input").addEventListener("input", (e) => {
      this.dispatchEvent(
        new CustomEvent("input", {
          detail: { value: e.target.value },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  attributeChangedCallback(name) {
    if (!this.shadowRoot.firstChild) return;
    if (name === "value") {
      const input = this.shadowRoot.querySelector("input");
      if (input && input.value !== this.getAttribute("value")) {
        input.value = this.getAttribute("value") || "";
      }
      return;
    }
    this.render();
  }

  get value() {
    return this.shadowRoot.querySelector("input")?.value ?? "";
  }

  set value(val) {
    const input = this.shadowRoot.querySelector("input");
    if (input) input.value = val;
  }

  render() {
    const label = this.getAttribute("label") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const type = this.getAttribute("type") || "text";
    const value = this.getAttribute("value") || "";

    this.shadowRoot.innerHTML = `
      <style>
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-1, 0.25rem);
          font-family: var(--font-family, inherit);
        }
        label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        input {
          font: inherit;
          padding: var(--spacing-2, 0.5rem);
          border-radius: var(--radius, 6px);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          background: var(--color-bg);
        }
        input:focus-visible {
          outline: 2px solid var(--color-focus);
          outline-offset: 1px;
        }
      </style>
      <div class="field">
        <label for="${this._id}">${label}</label>
        <input id="${this._id}" type="${type}" placeholder="${placeholder}" value="${value}" />
      </div>
    `;
  }
}

customElements.define("ui-textfield", UITextfield);
