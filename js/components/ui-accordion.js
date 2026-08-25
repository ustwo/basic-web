/**
 * <ui-accordion label="Shipping and returns" open>Free returns within 30 days.</ui-accordion>
 * One disclosure row. Fires "toggle" with detail.open.
 */
class UIAccordion extends HTMLElement {
  static get observedAttributes() { return ["label", "open", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const label = this.getAttribute("label") || "";
    const open = this.hasAttribute("open");
    const disabled = this.hasAttribute("disabled");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .item { border: var(--border-thin, 1px) solid var(--color-outline-variant); border-radius: var(--radius-md, 10px);
          background: var(--color-surface); overflow: hidden; }
        button {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: var(--spacing-4, 12px);
          padding: var(--spacing-4, 12px) var(--spacing-5, 16px);
          border: 0; background: transparent; cursor: pointer; text-align: left;
          font: var(--title-s); letter-spacing: var(--tracking-title-s); color: var(--color-on-surface);
          transition: background var(--duration-fast, 120ms) var(--ease-standard);
        }
        button:hover:not(:disabled) { background: var(--color-surface-container); }
        button:focus-visible { outline: none; box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        button:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
        svg { flex: none; width: 14px; height: 14px; color: var(--color-on-surface-variant);
          transition: transform var(--duration-base, 200ms) var(--ease-standard); }
        .open svg { transform: rotate(180deg); }
        .body { padding: 0 var(--spacing-5, 16px) var(--spacing-5, 16px);
          font: var(--body-m); color: var(--color-on-surface-variant); }
      </style>
      <div class="item ${open ? "open" : ""}" part="item">
        <button type="button" aria-expanded="${open}" ${disabled ? "disabled" : ""}>
          <span>${label}</span>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 5.5L7 9l3.5-3.5"></path></svg>
        </button>
        ${open ? '<div class="body"><slot></slot></div>' : ""}
      </div>
    `;
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      const next = !this.hasAttribute("open");
      next ? this.setAttribute("open", "") : this.removeAttribute("open");
      this.dispatchEvent(new CustomEvent("toggle", { detail: { open: next }, bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-accordion", UIAccordion);
export default UIAccordion;
