/**
 * <ui-alert variant="success" title="Saved" dismissible>Your changes are live.</ui-alert>
 * Variants: info, success, warning, danger. Fires "dismiss" when closed.
 */
class UIAlert extends HTMLElement {
  static get observedAttributes() { return ["variant", "title", "dismissible"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const variant = this.getAttribute("variant") || "info";
    const title = this.getAttribute("title") || "";
    const dismissible = this.hasAttribute("dismissible");
    const glyph = { info: "i", success: "✓", warning: "!", danger: "!" }[variant] || "i";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .alert {
          display: flex; align-items: flex-start; gap: var(--spacing-4, 12px);
          padding: var(--spacing-4, 12px) var(--spacing-5, 16px);
          border-radius: var(--radius-md, 10px);
          border: var(--border-thin, 1px) solid transparent;
          font: var(--body-m);
        }
        .icon {
          flex: none; width: 20px; height: 20px; border-radius: 50%;
          display: grid; place-items: center;
          font-size: 11px; font-weight: var(--weight-bold, 700);
          background: currentColor;
        }
        .icon > span { color: var(--color-surface); }
        .text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .title { font: var(--label-l); letter-spacing: var(--tracking-label-l); }
        .body { color: inherit; opacity: var(--opacity-muted, 0.85); }
        button {
          flex: none; border: 0; background: transparent; color: currentColor;
          cursor: pointer; font-size: 15px; line-height: 1; opacity: 0.6;
          width: 20px; height: 20px; border-radius: var(--radius-sm, 6px);
        }
        button:hover { opacity: 1; background: rgba(0,0,0,0.06); }
        .info { background: var(--color-primary-container); color: var(--color-primary); }
        .success { background: var(--color-success-container); color: var(--color-success); }
        .warning { background: var(--color-warning-container); color: var(--color-warning); }
        .danger { background: var(--color-error-container); color: var(--color-error); }
      </style>
      <div class="alert ${variant}" role="alert" part="alert">
        <span class="icon"><span>${glyph}</span></span>
        <span class="text">
          ${title ? `<span class="title">${title}</span>` : ""}
          <span class="body"><slot></slot></span>
        </span>
        ${dismissible ? '<button type="button" aria-label="Dismiss">×</button>' : ""}
      </div>
    `;
    const btn = this.shadowRoot.querySelector("button");
    if (btn) btn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("dismiss", { bubbles: true, composed: true }));
      this.remove();
    });
  }
}
customElements.define("ui-alert", UIAlert);
export default UIAlert;
