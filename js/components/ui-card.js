/**
 * <ui-card><span slot="header">Project status</span> Three tasks remain. <span slot="footer">Updated today</span></ui-card>
 * Slots: default (body), header, footer. Add "raised" for a stronger shadow,
 * or "flat" for a border-only card with no elevation.
 */
class UICard extends HTMLElement {
  static get observedAttributes() { return ["raised", "flat"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .card {
          background: var(--color-surface);
          border: var(--border-thin, 1px) solid var(--color-outline-variant);
          border-radius: var(--radius-lg, 14px);
          box-shadow: var(--elevation-1);
          overflow: hidden;
          transition: box-shadow var(--duration-base, 200ms) var(--ease-standard), transform var(--duration-base, 200ms) var(--ease-standard);
        }
        :host([raised]) .card { box-shadow: var(--elevation-3); }
        :host([flat]) .card { box-shadow: none; }
        :host([hoverable]) .card:hover { box-shadow: var(--elevation-2); transform: translateY(-2px); }
        header {
          padding: var(--spacing-5, 16px) var(--spacing-6, 20px);
          border-bottom: var(--border-thin, 1px) solid var(--color-outline-variant);
          font: var(--title-l);
        }
        .body { padding: var(--spacing-6, 20px); font: var(--body-m); color: var(--color-on-surface); }
        footer {
          padding: var(--spacing-4, 12px) var(--spacing-6, 20px);
          border-top: var(--border-thin, 1px) solid var(--color-outline-variant);
          background: var(--color-surface-container);
          font: var(--body-s); letter-spacing: var(--tracking-body-s); color: var(--color-on-surface-variant);
        }
        header:not(:has(slot[name="header"]))  { display: none; }
      </style>
      <div class="card" part="card">
        <header part="header"><slot name="header"></slot></header>
        <div class="body" part="body"><slot></slot></div>
        <footer part="footer"><slot name="footer"></slot></footer>
      </div>
    `;
    // A slot with nothing assigned still paints its padding and border, which reads as
    // an empty band. Hide the region rather than ask every caller to fill every slot.
    this.shadowRoot.querySelectorAll("slot[name]").forEach(slot => {
      const region = slot.parentElement;
      const sync = () => { region.style.display = slot.assignedNodes().length ? "" : "none"; };
      slot.addEventListener("slotchange", sync);
      sync();
    });
  }
}
customElements.define("ui-card", UICard);
export default UICard;
