/**
 * <ui-toast variant="success" message="Saved successfully" duration="4000"></ui-toast>
 * Appears fixed in the corner and removes itself after "duration" ms (0 keeps it).
 * Variants: info, success, warning, danger. Fires "dismiss" when it goes.
 */
class UIToast extends HTMLElement {
  static get observedAttributes() { return ["variant", "message", "duration", "position"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() {
    this.render();
    const ms = Number(this.getAttribute("duration") || 4000);
    if (ms > 0) this._timer = setTimeout(() => this.close(), ms);
  }
  disconnectedCallback() { clearTimeout(this._timer); }
  attributeChangedCallback() { if (this.shadowRoot.childElementCount) this.render(); }
  close() {
    const el = this.shadowRoot.querySelector(".toast");
    if (el) el.style.animation = "out var(--duration-base, 200ms) var(--ease-standard) forwards";
    this.dispatchEvent(new CustomEvent("dismiss", { bubbles: true, composed: true }));
    setTimeout(() => this.remove(), 220);
  }
  render() {
    const variant = this.getAttribute("variant") || "info";
    const message = this.getAttribute("message") || "";
    const position = this.getAttribute("position") || "bottom-right";
    const [v, h] = position.split("-");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host {
          position: fixed; z-index: var(--z-toast, 1400);
          ${v === "top" ? "top" : "bottom"}: var(--spacing-7, 24px);
          ${h === "left" ? "left" : "right"}: var(--spacing-7, 24px);
        }
        @keyframes in { from { opacity: 0; transform: translateY(${v === "top" ? "-" : ""}12px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes out { to { opacity: 0; transform: translateY(${v === "top" ? "-" : ""}8px) scale(0.98); } }
        .toast {
          display: flex; align-items: center; gap: var(--spacing-4, 12px);
          min-width: 260px; max-width: 380px;
          padding: var(--spacing-4, 12px) var(--spacing-5, 16px);
          background: var(--color-inverse-surface); color: var(--color-surface-container);
          border-radius: var(--radius-md, 10px);
          box-shadow: var(--elevation-5);
          font: var(--body-m);
          animation: in var(--duration-base, 200ms) var(--ease-spring);
        }
        i { flex: none; width: 8px; height: 8px; border-radius: 50%; }
        .info i { background: var(--color-primary); }
        .success i { background: var(--color-success); }
        .warning i { background: var(--color-warning); }
        .danger i { background: var(--color-error); }
        span { flex: 1; min-width: 0; }
        button { border: 0; background: transparent; color: inherit; opacity: 0.6; cursor: pointer; font-size: 15px; line-height: 1; }
        button:hover { opacity: 1; }
      </style>
      <div class="toast ${variant}" role="status" part="toast">
        <i></i><span>${message}<slot></slot></span>
        <button type="button" aria-label="Dismiss">×</button>
      </div>
    `;
    this.shadowRoot.querySelector("button").addEventListener("click", () => this.close());
  }
}
customElements.define("ui-toast", UIToast);
export default UIToast;
