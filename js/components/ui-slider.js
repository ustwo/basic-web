/**
 * <ui-slider label="Volume" value="60" min="0" max="100" step="1"></ui-slider>
 * Fires "input" with detail.value.
 */
class UISlider extends HTMLElement {
  static get observedAttributes() { return ["label", "value", "min", "max", "step", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this._input) this.paint(); else this.render(); }
  paint() {
    const min = Number(this.getAttribute("min") || 0);
    const max = Number(this.getAttribute("max") || 100);
    const val = Number(this.getAttribute("value") || 0);
    const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
    this._input.style.setProperty("--pct", pct + "%");
    this._out.textContent = String(val);
  }
  render() {
    const label = this.getAttribute("label") || "";
    const value = this.getAttribute("value") || "50";
    const min = this.getAttribute("min") || "0";
    const max = this.getAttribute("max") || "100";
    const step = this.getAttribute("step") || "1";
    const disabled = this.hasAttribute("disabled");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .field { display: flex; flex-direction: column; gap: var(--spacing-3, 8px); }
        .top { display: flex; align-items: baseline; justify-content: space-between; gap: var(--spacing-4, 12px); }
        label { font: var(--label-m); letter-spacing: var(--tracking-label-m); }
        output { font: var(--body-s); font-family: var(--font-family-mono); color: var(--color-on-surface-variant); }
        input {
          -webkit-appearance: none; appearance: none; width: 100%; height: 6px; margin: 0;
          border-radius: var(--radius-pill, 9999px);
          background: linear-gradient(to right, var(--color-primary) var(--pct, 50%), var(--color-surface-container-highest) var(--pct, 50%));
          outline: none; cursor: pointer;
        }
        input::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: var(--radius-pill, 9999px);
          background: var(--color-surface); border: var(--border-medium, 2px) solid var(--color-primary);
          box-shadow: var(--elevation-1); cursor: grab;
          transition: transform var(--duration-fast, 120ms) var(--ease-spring);
        }
        input::-webkit-slider-thumb:active { transform: scale(1.15); cursor: grabbing; }
        input::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--color-surface); border: 2px solid var(--color-primary); cursor: grab;
        }
        input:focus-visible { box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
      </style>
      <div class="field">
        <div class="top">
          ${label ? `<label>${label}</label>` : "<span></span>"}
          <output>${value}</output>
        </div>
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" ${disabled ? "disabled" : ""} />
      </div>
    `;
    this._input = this.shadowRoot.querySelector("input");
    this._out = this.shadowRoot.querySelector("output");
    this.paint();
    this._input.addEventListener("input", e => {
      this.setAttribute("value", e.target.value);
      this.dispatchEvent(new CustomEvent("input", { detail: { value: Number(e.target.value) }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-slider", UISlider);
export default UISlider;
