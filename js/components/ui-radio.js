/**
 * <ui-radio name="group" value="a" label="Option A" checked></ui-radio>
 * Radios sharing the same `name` form a group; checking one unchecks the
 * rest. Fires a "change" event with detail: { value }.
 */
const radioGroups = new Map();

class UIRadio extends HTMLElement {
  static get observedAttributes() {
    return ["label", "checked", "name", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._id = `ui-radio-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    this.render();
    this._group = this.getAttribute("name") || "";
    if (!radioGroups.has(this._group)) radioGroups.set(this._group, new Set());
    radioGroups.get(this._group).add(this);

    // Delegated on shadowRoot (not the <input>) so it survives render()
    // replacing the shadow DOM's children on every attribute change.
    this.shadowRoot.addEventListener("change", (e) => {
      if (!e.target.checked) return;
      this.setAttribute("checked", "");
      for (const other of radioGroups.get(this._group) || []) {
        if (other !== this) other.removeAttribute("checked");
      }
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: { value: this.getAttribute("value") },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  disconnectedCallback() {
    radioGroups.get(this._group)?.delete(this);
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
        <input id="${this._id}" type="radio" ${checked ? "checked" : ""} />
        <label for="${this._id}">${label}</label>
      </div>
    `;
  }
}

customElements.define("ui-radio", UIRadio);
