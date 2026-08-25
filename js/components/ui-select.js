/**
 * <ui-select label="Favourite colour" options="Red,Green,Blue" value="Green"></ui-select>
 * Fires "change" with detail.value.
 */
class UISelect extends HTMLElement {
  static get observedAttributes() { return ["label", "options", "value", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const label = this.getAttribute("label") || "";
    const options = (this.getAttribute("options") || "").split(",").map(o => o.trim()).filter(Boolean);
    const value = this.getAttribute("value") || "";
    const disabled = this.hasAttribute("disabled");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .field { display: flex; flex-direction: column; gap: var(--spacing-2, 4px); }
        label { font: var(--label-m); letter-spacing: var(--tracking-label-m); }
        .box { position: relative; display: flex; align-items: center; }
        select {
          appearance: none; width: 100%;
          font: var(--body-m); color: var(--color-on-surface);
          background: var(--color-surface-container);
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-md, 10px);
          padding: var(--spacing-3, 8px) var(--spacing-8, 32px) var(--spacing-3, 8px) var(--spacing-4, 12px);
          min-height: 40px; outline: none; cursor: pointer;
          transition: background var(--duration-fast, 120ms) var(--ease-standard), box-shadow var(--duration-fast, 120ms) var(--ease-standard);
        }
        select:hover { background: var(--color-surface-container-highest); }
        select:focus { background: var(--color-surface); border-color: var(--color-primary); box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        svg { position: absolute; right: var(--spacing-4, 12px); width: 14px; height: 14px; color: var(--color-on-surface-variant); pointer-events: none; }
      </style>
      <div class="field">
        ${label ? `<label>${label}</label>` : ""}
        <div class="box">
          <select ${disabled ? "disabled" : ""}>
            ${options.map(o => `<option value="${o}" ${o === value ? "selected" : ""}>${o}</option>`).join("")}
          </select>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 5.5L7 9l3.5-3.5"></path></svg>
        </div>
      </div>
    `;
    this.shadowRoot.querySelector("select").addEventListener("change", e => {
      this.setAttribute("value", e.target.value);
      this.dispatchEvent(new CustomEvent("change", { detail: { value: e.target.value }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-select", UISelect);
export default UISelect;
