/**
 * <ui-textarea label="Notes" placeholder="Anything we should know" rows="4" value=""></ui-textarea>
 * Fires "input" with detail.value.
 */
class UITextarea extends HTMLElement {
  static get observedAttributes() { return ["label", "placeholder", "value", "rows", "hint", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const label = this.getAttribute("label") || "";
    const placeholder = this.getAttribute("placeholder") || "";
    const value = this.getAttribute("value") || "";
    const rows = this.getAttribute("rows") || "4";
    const hint = this.getAttribute("hint") || "";
    const disabled = this.hasAttribute("disabled");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .field { display: flex; flex-direction: column; gap: var(--spacing-2, 4px); }
        label { font: var(--label-m); letter-spacing: var(--tracking-label-m); }
        textarea {
          width: 100%; resize: vertical;
          font: var(--body-m); color: var(--color-on-surface);
          background: var(--color-surface-container);
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-md, 10px);
          padding: var(--spacing-4, 12px);
          outline: none;
          transition: background var(--duration-fast, 120ms) var(--ease-standard), box-shadow var(--duration-fast, 120ms) var(--ease-standard);
        }
        textarea:hover { background: var(--color-surface-container-highest); }
        textarea:focus { background: var(--color-surface); border-color: var(--color-primary); box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        textarea::placeholder { color: var(--color-on-surface-muted); }
        .note { font: var(--body-s); letter-spacing: var(--tracking-body-s); color: var(--color-on-surface-variant); }
      </style>
      <div class="field">
        ${label ? `<label>${label}</label>` : ""}
        <textarea rows="${rows}" placeholder="${placeholder}" ${disabled ? "disabled" : ""}>${value}</textarea>
        ${hint ? `<span class="note">${hint}</span>` : ""}
      </div>
    `;
    this.shadowRoot.querySelector("textarea").addEventListener("input", e => {
      this.setAttribute("value", e.target.value);
      this.dispatchEvent(new CustomEvent("input", { detail: { value: e.target.value }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-textarea", UITextarea);
export default UITextarea;
