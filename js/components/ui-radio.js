/**
 * <ui-radio name="plan" value="pro" label="Pro"></ui-radio>
 * Radios sharing a name form a group: checking one clears the others.
 * Fires "change" with detail.value.
 */
class UIRadio extends HTMLElement {
  static get observedAttributes() { return ["name", "value", "label", "checked", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const name = this.getAttribute("name") || "";
    const value = this.getAttribute("value") || "";
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
        .dot {
          width: 20px; height: 20px; flex: none;
          border: var(--border-medium, 2px) solid var(--color-outline);
          border-radius: var(--radius-pill, 9999px);
          background: var(--color-surface);
          display: grid; place-items: center;
          transition: border-color var(--duration-fast, 120ms) var(--ease-standard);
        }
        .dot::after {
          content: ""; width: 10px; height: 10px; border-radius: var(--radius-pill, 9999px);
          background: var(--color-primary); transform: scale(0);
          transition: transform var(--duration-fast, 120ms) var(--ease-spring);
        }
        input:checked + .dot { border-color: var(--color-primary); }
        input:checked + .dot::after { transform: scale(1); }
        input:focus-visible + .dot { box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
      </style>
      <label ${disabled ? "data-disabled" : ""}>
        <input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
        <span class="dot" part="dot"></span>
        <span>${label}</span>
      </label>
    `;
    this.shadowRoot.querySelector("input").addEventListener("change", e => {
      if (!e.target.checked) return;
      this.setAttribute("checked", "");
      // Shadow DOM isolates each radio, so the group has to be maintained here.
      if (name) {
        document.querySelectorAll(`ui-radio[name="${name}"]`).forEach(r => { if (r !== this) r.removeAttribute("checked"); });
      }
      this.dispatchEvent(new CustomEvent("change", { detail: { value }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-radio", UIRadio);
export default UIRadio;
