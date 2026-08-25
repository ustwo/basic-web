/**
 * <ui-pagination page="3" total="12"></ui-pagination>
 * Fires "change" with detail.page. Long ranges collapse with an ellipsis, so the
 * control keeps a stable width however many pages there are.
 */
class UIPagination extends HTMLElement {
  static get observedAttributes() { return ["page", "total", "siblings"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  pages() {
    const page = Math.max(1, Number(this.getAttribute("page") || 1));
    const total = Math.max(1, Number(this.getAttribute("total") || 1));
    const sib = Math.max(1, Number(this.getAttribute("siblings") || 1));
    if (total <= 5 + sib * 2) return Array.from({ length: total }, (_, i) => i + 1);
    const out = [1];
    const from = Math.max(2, page - sib);
    const to = Math.min(total - 1, page + sib);
    if (from > 2) out.push("...");
    for (let i = from; i <= to; i++) out.push(i);
    if (to < total - 1) out.push("...");
    out.push(total);
    return out;
  }
  render() {
    const page = Math.max(1, Number(this.getAttribute("page") || 1));
    const total = Math.max(1, Number(this.getAttribute("total") || 1));
    const items = this.pages();
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        nav { display: flex; align-items: center; gap: var(--spacing-2, 4px); }
        button {
          min-width: 36px; height: 36px; padding: 0 var(--spacing-3, 8px);
          border: 0; background: transparent; cursor: pointer;
          font: var(--label-m); letter-spacing: var(--tracking-label-m); color: var(--color-on-surface-variant);
          border-radius: var(--radius-sm, 6px);
          display: inline-grid; place-items: center;
          transition: background var(--duration-fast, 120ms) var(--ease-standard), color var(--duration-fast, 120ms) var(--ease-standard);
        }
        button:hover:not(:disabled):not([aria-current]) { background: var(--color-surface-container); color: var(--color-on-surface); }
        button[aria-current] { background: var(--color-primary); color: var(--color-on-primary); }
        button:disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
        button:focus-visible { outline: none; box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        span { min-width: 24px; text-align: center; color: var(--color-on-surface-muted); font: var(--body-m); }
        svg { width: 14px; height: 14px; }
      </style>
      <nav aria-label="Pagination" part="nav">
        <button type="button" data-go="${page - 1}" aria-label="Previous page" ${page <= 1 ? "disabled" : ""}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8.5 3.5L5 7l3.5 3.5"></path></svg>
        </button>
        ${items.map(p => p === "..." ? "<span>…</span>"
          : `<button type="button" data-go="${p}" ${p === page ? 'aria-current="page"' : ""}>${p}</button>`).join("")}
        <button type="button" data-go="${page + 1}" aria-label="Next page" ${page >= total ? "disabled" : ""}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5.5 3.5L9 7l-3.5 3.5"></path></svg>
        </button>
      </nav>
    `;
    this.shadowRoot.querySelectorAll("button[data-go]").forEach(b => {
      b.addEventListener("click", () => {
        const go = Number(b.getAttribute("data-go"));
        if (go < 1 || go > total || go === page) return;
        this.setAttribute("page", String(go));
        this.dispatchEvent(new CustomEvent("change", { detail: { page: go }, bubbles: true, composed: true }));
      });
    });
  }
}
customElements.define("ui-pagination", UIPagination);
export default UIPagination;
