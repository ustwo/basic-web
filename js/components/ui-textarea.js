/**
 * <ui-textarea label="Bio" placeholder="..." rows="4" value="..."></ui-textarea>
 * Fires an "input" event with detail: { value }.
 */
class UITextarea extends HTMLElement {
  static get observedAttributes() {
    return ["label", "placeholder", "value", "rows"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._id = `ui-textarea-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    this.render();
    // Delegated on shadowRoot (not the <textarea>) so it survives render()
    // replacing the shadow DOM's children on every attribute change.
    this.shadowRoot.addEventListener("input", (e) => {
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
      const textarea = this.shadowRoot.querySelector("textarea");
      if (textarea && textarea.value !== this.getAttribute("value")) {
        textarea.value = this.getAttribute("value") || "";
      }
      return;
    }
    this.render();
  }

  get value() {
    return this.shadowRoot.querySelector("textarea")?.value ?? "";
  }

  set value(val) {
    const textarea = this.shadowRoot.querySelector("textarea");
    if (textarea) textarea.value = val;
  }

  render() {
    const label = this.getAttribute("label") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const value = this.getAttribute("value") || "";
    const rows = this.getAttribute("rows") || "4";

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
        textarea {
          font: inherit;
          padding: var(--spacing-2, 0.5rem);
          border-radius: var(--radius, 6px);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          background: var(--color-bg);
          resize: vertical;
        }
        textarea:focus-visible {
          outline: 2px solid var(--color-focus);
          outline-offset: 1px;
        }
      </style>
      <div class="field">
        <label for="${this._id}">${label}</label>
        <textarea id="${this._id}" rows="${rows}" placeholder="${placeholder}">${value}</textarea>
      </div>
    `;
  }
}

customElements.define("ui-textarea", UITextarea);
