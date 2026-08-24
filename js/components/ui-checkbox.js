/**
 * <ui-checkbox label="..." checked></ui-checkbox>
 * Fires a "change" event with detail: { checked }.
 */
class UICheckbox extends HTMLElement {
  static get observedAttributes() {
    return ["label", "checked"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._id = `ui-checkbox-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        this.setAttribute("checked", "");
      } else {
        this.removeAttribute("checked");
      }
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { checked: e.target.checked },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  attributeChangedCallback() {
    this.render();
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(val) {
    if (val) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
  }

  render() {
    const label = this.getAttribute("label") || "";
    const checked = this.hasAttribute("checked");

    this.shadowRoot.innerHTML = `
      <style>
        .field {
          display: flex;
          align-items: center;
          gap: var(--spacing-2, 0.5rem);
          font-family: var(--font-family, inherit);
        }
        input {
          width: 1.1rem;
          height: 1.1rem;
          accent-color: var(--color-primary);
        }
        label {
          color: var(--color-text);
          font-size: 0.95rem;
        }
      </style>
      <div class="field">
        <input id="${this._id}" type="checkbox" ${checked ? "checked" : ""} />
        <label for="${this._id}">${label}</label>
      </div>
    `;
  }
}

customElements.define("ui-checkbox", UICheckbox);
