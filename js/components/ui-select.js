/**
 * <ui-select label="..." options="A,B,C" value="A"></ui-select>
 * Fires a "change" event with detail: { value }.
 */
class UISelect extends HTMLElement {
  static get observedAttributes() {
    return ["label", "options", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._id = `ui-select-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("select").addEventListener("change", (e) => {
      this.setAttribute("value", e.target.value);
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: e.target.value },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  attributeChangedCallback() {
    this.render();
  }

  get value() {
    return this.shadowRoot.querySelector("select")?.value ?? "";
  }

  set value(val) {
    this.setAttribute("value", val);
  }

  render() {
    const label = this.getAttribute("label") || "";
    const options = (this.getAttribute("options") || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    const value = this.getAttribute("value") || options[0] || "";

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
          color: var(--color-text-muted, #5b6270);
        }
        select {
          font: inherit;
          padding: var(--spacing-2, 0.5rem);
          border-radius: var(--radius, 6px);
          border: 1px solid var(--color-border, #d7dbe0);
          color: var(--color-text, #1a1d21);
          background: var(--color-bg, #fff);
        }
        select:focus-visible {
          outline: 2px solid var(--color-focus, #2f6fed);
          outline-offset: 1px;
        }
      </style>
      <div class="field">
        <label for="${this._id}">${label}</label>
        <select id="${this._id}">
          ${options
            .map(
              (o) => `<option value="${o}" ${o === value ? "selected" : ""}>${o}</option>`
            )
            .join("")}
        </select>
      </div>
    `;
  }
}

customElements.define("ui-select", UISelect);
