/**
 * <ui-toggle label="Enable notifications"></ui-toggle>
 * Fires "change" with detail.checked.
 */
class UIToggle extends HTMLElement {
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
        input { position: absolute; opacity: 0; width: 0; height: 0; }
        .track {
          width: 44px; height: 26px; flex: none;
          background: var(--color-outline-variant);
          border-radius: var(--radius-pill, 9999px);
          padding: 3px;
          transition: background var(--duration-base, 200ms) var(--ease-standard);
        }
        .knob {
          width: 20px; height: 20px;
          background: var(--color-surface);
          border-radius: var(--radius-pill, 9999px);
          box-shadow: var(--elevation-1);
          transition: transform var(--duration-base, 200ms) var(--ease-spring);
        }
        input:checked + .track { background: var(--color-primary); }
        input:checked + .track .knob { transform: translateX(18px); }
        input:focus-visible + .track { box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
      </style>
      <label ${disabled ? "data-disabled" : ""}>
        <input type="checkbox" role="switch" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span class="track" part="track"><span class="knob"></span></span>
        <span>${label}</span>
      </label>
    `;
    this.shadowRoot.querySelector("input").addEventListener("change", e => {
      e.target.checked ? this.setAttribute("checked", "") : this.removeAttribute("checked");
      this.dispatchEvent(new CustomEvent("change", { detail: { checked: e.target.checked }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-toggle", UIToggle);
export default UIToggle;
