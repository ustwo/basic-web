/**
 * <ui-checkbox label="Subscribe to updates"></ui-checkbox>
 * Fires "change" with detail.checked.
 */
class UICheckbox extends HTMLElement {
  static get observedAttributes() { return ["label", "checked", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const label = this.getAttribute("label") || "";
    const checked = this.hasAttribute("checked");
    const disabled = this.hasAttribute("disabled");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        label { display: inline-flex; align-items: center; gap: var(--spacing-3, 8px); cursor: pointer; font: var(--body-m); }
        label[data-disabled] { opacity: var(--opacity-disabled); cursor: not-allowed; }
        .box {
          width: 20px; height: 20px; flex: none;
          border: var(--border-medium, 2px) solid var(--color-outline);
          border-radius: var(--radius-sm, 6px);
          background: var(--color-surface);
          display: grid; place-items: center;
          transition: background var(--duration-fast, 120ms) var(--ease-standard),
                      border-color var(--duration-fast, 120ms) var(--ease-standard),
                      transform var(--duration-fast, 120ms) var(--ease-spring);
        }
        input { position: absolute; opacity: 0; width: 0; height: 0; }
        input:checked + .box { background: var(--color-primary); border-color: var(--color-primary); transform: scale(1.04); }
        input:focus-visible + .box { box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        svg { width: 12px; height: 12px; color: var(--color-on-primary); opacity: 0; transition: opacity var(--duration-fast, 120ms) var(--ease-out); }
        input:checked + .box svg { opacity: 1; }
      </style>
      <label ${disabled ? "data-disabled" : ""}>
        <input type="checkbox" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span class="box" part="box">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6.4l2.6 2.6L10 3.4"></path></svg>
        </span>
        <span>${label}</span>
      </label>
    `;
    this.shadowRoot.querySelector("input").addEventListener("change", e => {
      e.target.checked ? this.setAttribute("checked", "") : this.removeAttribute("checked");
      this.dispatchEvent(new CustomEvent("change", { detail: { checked: e.target.checked }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-checkbox", UICheckbox);
export default UICheckbox;
