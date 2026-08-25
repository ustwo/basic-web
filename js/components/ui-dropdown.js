/**
 * <ui-dropdown label="Actions" options="Edit,Duplicate,Delete"></ui-dropdown>
 * A menu button. Fires "select" with detail.value and detail.index.
 */
class UIDropdown extends HTMLElement {
  static get observedAttributes() { return ["label", "options", "align", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); this._open = false; }
  connectedCallback() {
    this.render();
    this._onDoc = e => { if (!this.contains(e.target)) this.setOpen(false); };
    document.addEventListener("click", this._onDoc);
  }
  disconnectedCallback() { document.removeEventListener("click", this._onDoc); }
  attributeChangedCallback() { if (this.shadowRoot.childElementCount) this.render(); }
  setOpen(v) {
    this._open = v;
    const menu = this.shadowRoot.querySelector(".menu");
    const btn = this.shadowRoot.querySelector(".trigger");
    if (menu) menu.classList.toggle("show", v);
    if (btn) btn.setAttribute("aria-expanded", String(v));
  }
  render() {
    const label = this.getAttribute("label") || "Menu";
    const options = (this.getAttribute("options") || "").split(",").map(o => o.trim()).filter(Boolean);
    const align = this.getAttribute("align") || "start";
    const disabled = this.hasAttribute("disabled");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-block; }
        .wrap { position: relative; display: inline-flex; }
        .trigger {
          display: inline-flex; align-items: center; gap: var(--spacing-3, 8px);
          font: var(--label-m); letter-spacing: var(--tracking-label-m);
          background: var(--color-surface-container); color: var(--color-on-surface);
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-md, 10px);
          padding: var(--spacing-3, 8px) var(--spacing-5, 16px); min-height: 40px;
          cursor: pointer;
          transition: background var(--duration-fast, 120ms) var(--ease-standard);
        }
        .trigger:hover:not(:disabled) { background: var(--color-surface-container-highest); }
        .trigger:focus-visible { outline: none; box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        .trigger:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
        svg { width: 12px; height: 12px; color: var(--color-on-surface-variant); transition: transform var(--duration-fast, 120ms) var(--ease-standard); }
        .menu.show ~ .trigger svg, .trigger[aria-expanded="true"] svg { transform: rotate(180deg); }
        .menu {
          position: absolute; top: calc(100% + 6px); ${align === "end" ? "right: 0;" : "left: 0;"}
          z-index: var(--z-dropdown, 1000);
          min-width: 180px; padding: var(--spacing-2, 4px);
          background: var(--color-surface);
          border: var(--border-thin, 1px) solid var(--color-outline-variant);
          border-radius: var(--radius-md, 10px);
          box-shadow: var(--elevation-3);
          opacity: 0; transform: translateY(-4px) scale(0.98); pointer-events: none;
          transition: opacity var(--duration-fast, 120ms) var(--ease-out), transform var(--duration-fast, 120ms) var(--ease-out);
        }
        .menu.show { opacity: 1; transform: none; pointer-events: auto; }
        .menu button {
          display: block; width: 100%; text-align: left;
          border: 0; background: transparent; cursor: pointer;
          font: var(--body-m); color: var(--color-on-surface);
          padding: var(--spacing-3, 8px) var(--spacing-4, 12px);
          border-radius: var(--radius-sm, 6px);
        }
        .menu button:hover { background: var(--color-surface-container); }
        .menu button:focus-visible { outline: none; background: var(--color-primary-container); color: var(--color-primary); }
      </style>
      <div class="wrap">
        <button class="trigger" type="button" aria-haspopup="menu" aria-expanded="false" ${disabled ? "disabled" : ""}>
          <span>${label}</span>
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 4.5L6 7.5l3-3"></path></svg>
        </button>
        <div class="menu" role="menu" part="menu">
          ${options.map(o => `<button type="button" role="menuitem">${o}</button>`).join("")}
        </div>
      </div>
    `;
    this.shadowRoot.querySelector(".trigger").addEventListener("click", e => {
      e.stopPropagation();
      this.setOpen(!this._open);
    });
    this.shadowRoot.querySelectorAll(".menu button").forEach((b, i) => {
      b.addEventListener("click", () => {
        this.setOpen(false);
        this.dispatchEvent(new CustomEvent("select", { detail: { value: b.textContent, index: i }, bubbles: true, composed: true }));
      });
    });
  }
}
customElements.define("ui-dropdown", UIDropdown);
export default UIDropdown;
