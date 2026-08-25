/**
 * <ui-tabs selected="0"><div label="Overview">Overview panel.</div><div label="Details">Details panel.</div></ui-tabs>
 * Each direct child is a panel; its "label" attribute becomes the tab title.
 * Fires "change" with detail.index.
 */
class UITabs extends HTMLElement {
  static get observedAttributes() { return ["selected", "variant"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const selected = Number(this.getAttribute("selected") || 0);
    const variant = this.getAttribute("variant") || "solid";
    const panels = Array.from(this.children);
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .tabs { display: flex; gap: var(--spacing-2, 4px); padding: var(--spacing-1, 2px);
          background: var(--color-surface-container); border-radius: var(--radius-md, 10px);
          margin-bottom: var(--spacing-5, 16px); overflow-x: auto; }
        .underline .tabs { background: transparent; padding: 0; gap: var(--spacing-6, 20px);
          border-bottom: var(--border-thin, 1px) solid var(--color-outline-variant); border-radius: 0; }
        button {
          border: 0; background: transparent; cursor: pointer; white-space: nowrap;
          font: var(--label-m); letter-spacing: var(--tracking-label-m);
          color: var(--color-on-surface-variant);
          padding: var(--spacing-3, 8px) var(--spacing-5, 16px);
          border-radius: var(--radius-sm, 6px);
          transition: background var(--duration-fast, 120ms) var(--ease-standard), color var(--duration-fast, 120ms) var(--ease-standard);
        }
        button:hover { color: var(--color-on-surface); }
        button[aria-selected="true"] { background: var(--color-surface); color: var(--color-on-surface); box-shadow: var(--elevation-1); }
        button:focus-visible { outline: none; box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        .underline button { border-radius: 0; padding: var(--spacing-3, 8px) 0;
          border-bottom: var(--border-medium, 2px) solid transparent; margin-bottom: -1px; }
        .underline button[aria-selected="true"] { background: transparent; box-shadow: none;
          color: var(--color-primary); border-bottom-color: var(--color-primary); }
      </style>
      <div class="${variant === "underline" ? "underline" : ""}">
        <div class="tabs" role="tablist" part="tablist">
          ${panels.map((p, i) => `<button type="button" role="tab" aria-selected="${i === selected}">${p.getAttribute("label") || "Tab " + (i + 1)}</button>`).join("")}
        </div>
        <div class="panel" part="panel"><slot></slot></div>
      </div>
    `;
    panels.forEach((p, i) => { p.style.display = i === selected ? "" : "none"; });
    this.shadowRoot.querySelectorAll("button").forEach((b, i) => {
      b.addEventListener("click", () => {
        this.setAttribute("selected", String(i));
        this.dispatchEvent(new CustomEvent("change", { detail: { index: i }, bubbles: true, composed: true }));
      });
    });
  }
}
customElements.define("ui-tabs", UITabs);
export default UITabs;
