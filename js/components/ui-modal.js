/**
 * <ui-modal heading="Delete project" open><p>This cannot be undone.</p><ui-button slot="footer" variant="danger">Delete</ui-button></ui-modal>
 * Slots: default (body), footer. Fires "close" when dismissed.
 * Closes on scrim click, on the close button, and on Escape.
 */
class UIModal extends HTMLElement {
  static get observedAttributes() { return ["heading", "open", "size"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() {
    this.render();
    this._onKey = e => { if (e.key === "Escape" && this.hasAttribute("open")) this.close(); };
    document.addEventListener("keydown", this._onKey);
  }
  disconnectedCallback() { document.removeEventListener("keydown", this._onKey); }
  attributeChangedCallback() { if (this.shadowRoot.childElementCount) this.render(); }
  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }
  render() {
    const heading = this.getAttribute("heading") || "";
    const open = this.hasAttribute("open");
    const size = this.getAttribute("size") || "md";
    const width = { sm: "380px", md: "520px", lg: "720px" }[size] || "520px";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: contents; }
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lift { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
        .scrim {
          position: fixed; inset: 0; z-index: var(--z-modal, 1300);
          background: var(--color-scrim, rgba(0,0,0,0.4));
          backdrop-filter: blur(2px);
          display: grid; place-items: center;
          padding: var(--spacing-7, 24px);
          animation: fade var(--duration-base, 200ms) var(--ease-out);
        }
        .dialog {
          width: 100%; max-width: ${width}; max-height: 88vh; overflow: auto;
          background: var(--color-surface);
          border-radius: var(--radius-lg, 14px);
          box-shadow: var(--elevation-5);
          animation: lift var(--duration-base, 200ms) var(--ease-spring);
        }
        header {
          display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-4, 12px);
          padding: var(--spacing-5, 16px) var(--spacing-6, 20px);
          border-bottom: var(--border-thin, 1px) solid var(--color-outline-variant);
        }
        h2 { margin: 0; font: var(--title-l); }
        .body { padding: var(--spacing-6, 20px); font: var(--body-m); color: var(--color-on-surface); }
        footer {
          display: flex; justify-content: flex-end; gap: var(--spacing-3, 8px);
          padding: var(--spacing-4, 12px) var(--spacing-6, 20px);
          border-top: var(--border-thin, 1px) solid var(--color-outline-variant);
          background: var(--color-surface-container);
        }
        .x { border: 0; background: transparent; color: var(--color-on-surface-variant); cursor: pointer;
          width: 28px; height: 28px; border-radius: var(--radius-sm, 6px); font-size: 16px; line-height: 1; }
        .x:hover { background: var(--color-surface-container); color: var(--color-on-surface); }
      </style>
      ${open ? `
        <div class="scrim" part="scrim">
          <div class="dialog" role="dialog" aria-modal="true" ${heading ? 'aria-label="' + heading + '"' : ""} part="dialog">
            ${heading ? `<header><h2>${heading}</h2><button class="x" type="button" aria-label="Close">×</button></header>` : ""}
            <div class="body"><slot></slot></div>
            <footer><slot name="footer"></slot></footer>
          </div>
        </div>` : ""}
    `;
    if (!open) return;
    const x = this.shadowRoot.querySelector(".x");
    if (x) x.addEventListener("click", () => this.close());
    this.shadowRoot.querySelector(".scrim").addEventListener("click", e => {
      if (e.target === e.currentTarget) this.close();
    });
    const footer = this.shadowRoot.querySelector("footer");
    const slot = footer.querySelector("slot");
    const sync = () => { footer.style.display = slot.assignedNodes().length ? "" : "none"; };
    slot.addEventListener("slotchange", sync);
    sync();
  }
}
customElements.define("ui-modal", UIModal);
export default UIModal;
