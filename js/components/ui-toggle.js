/**
 * <ui-toggle label="..." checked></ui-toggle>
 * Fires a "change" event with detail: { checked }.
 */
class UIToggle extends HTMLElement {
  static get observedAttributes() {
    return ["label", "checked"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._id = `ui-toggle-${Math.random().toString(36).slice(2, 9)}`;
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
        .switch {
          position: relative;
          display: inline-block;
          width: 2.25rem;
          height: 1.25rem;
        }
        .switch input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          cursor: pointer;
        }
        .track {
          position: absolute;
          inset: 0;
          background: var(--color-border, #d7dbe0);
          border-radius: 999px;
          transition: background 0.15s ease;
        }
        .thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 1rem;
          height: 1rem;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.15s ease;
        }
        input:checked ~ .track {
          background: var(--color-primary, #2f6fed);
        }
        input:checked ~ .thumb {
          transform: translateX(1rem);
        }
        input:focus-visible ~ .track {
          outline: 2px solid var(--color-focus, #2f6fed);
          outline-offset: 2px;
        }
        label {
          color: var(--color-text, #1a1d21);
          font-size: 0.95rem;
        }
      </style>
      <div class="field">
        <span class="switch">
          <input id="${this._id}" type="checkbox" role="switch" ${checked ? "checked" : ""} />
          <span class="track"></span>
          <span class="thumb"></span>
        </span>
        <label for="${this._id}">${label}</label>
      </div>
    `;
  }
}

customElements.define("ui-toggle", UIToggle);
