/**
 * <ui-textfield label="Full name" placeholder="Jane Doe" value="" hint="As it appears on your ID"></ui-textfield>
 * Fires "input" with detail.value on every keystroke.
 * Add "invalid" with an "error" message to show the error state.
 */
class UITextfield extends HTMLElement {
  static get observedAttributes() { return ["label", "placeholder", "type", "value", "hint", "error", "invalid", "disabled"]; }

  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  get value() { return this.getAttribute("value") || ""; }
  set value(v) { this.setAttribute("value", v); }

  render() {
    const label = this.getAttribute("label") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const type = this.getAttribute("type") || "text";
    const value = this.getAttribute("value") || "";
    const hint = this.getAttribute("hint") || "";
    const error = this.getAttribute("error") || "";
    const invalid = this.hasAttribute("invalid") || !!error;
    const disabled = this.hasAttribute("disabled");

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .field { display: flex; flex-direction: column; gap: var(--spacing-2, 4px); }
        label { font: var(--label-m); letter-spacing: var(--tracking-label-m); color: var(--color-on-surface); }
        .box {
          display: flex; align-items: center; gap: var(--spacing-3, 8px);
          background: var(--color-surface-container);
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-md, 10px);
          padding: 0 var(--spacing-4, 12px);
          min-height: 40px;
          transition: background var(--duration-fast, 120ms) var(--ease-standard),
                      border-color var(--duration-fast, 120ms) var(--ease-standard),
                      box-shadow var(--duration-fast, 120ms) var(--ease-standard);
        }
        .box:hover { background: var(--color-surface-container-highest); }
        .box:focus-within { background: var(--color-surface); border-color: var(--color-primary); box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        .box.invalid { border-color: var(--color-error); background: var(--color-error-container); }
        .box.invalid:focus-within { box-shadow: 0 0 0 3px var(--color-error-container); }
        input {
          flex: 1; min-width: 0;
          border: 0; background: transparent; outline: none;
          font: var(--body-m); color: var(--color-on-surface);
          padding: var(--spacing-3, 8px) 0;
        }
        input::placeholder { color: var(--color-on-surface-muted); }
        input:disabled { cursor: not-allowed; }
        .note { font: var(--body-s); letter-spacing: var(--tracking-body-s); color: var(--color-on-surface-variant); }
        .note.err { color: var(--color-error); }
        :host([disabled]) .field { opacity: var(--opacity-disabled); }
      </style>
      <div class="field">
        ${label ? `<label part="label">${label}</label>` : ""}
        <div class="box ${invalid ? "invalid" : ""}" part="box">
          <input type="${type}" placeholder="${placeholder}" value="${value}" ${disabled ? "disabled" : ""}
            ${invalid ? 'aria-invalid="true"' : ""} />
        </div>
        ${error ? `<span class="note err">${error}</span>` : (hint ? `<span class="note">${hint}</span>` : "")}
      </div>
    `;

    this.shadowRoot.querySelector("input").addEventListener("input", e => {
      this.setAttribute("value", e.target.value);
      this.dispatchEvent(new CustomEvent("input", { detail: { value: e.target.value }, bubbles: true, composed: true }));
    });
  }
}

customElements.define("ui-textfield", UITextfield);
export default UITextfield;
