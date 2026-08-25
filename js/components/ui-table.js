/**
 * <ui-table columns="Name,Role,Status" rows="Jane Doe|Designer|Active;Sam Reed|Engineer|Away"></ui-table>
 * Columns are comma-separated; rows are semicolon-separated with pipe-separated cells.
 * Add "striped" or "compact" to change density. Fires "rowclick" with detail.index.
 */
class UITable extends HTMLElement {
  static get observedAttributes() { return ["columns", "rows", "striped", "compact", "caption"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const columns = (this.getAttribute("columns") || "").split(",").map(c => c.trim()).filter(Boolean);
    const rows = (this.getAttribute("rows") || "").split(";").map(r => r.trim()).filter(Boolean)
      .map(r => r.split("|").map(c => c.trim()));
    const caption = this.getAttribute("caption") || "";
    const compact = this.hasAttribute("compact");
    const pad = compact ? "var(--spacing-3, 8px)" : "var(--spacing-4, 12px)";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .frame {
          border: var(--border-thin, 1px) solid var(--color-outline-variant);
          border-radius: var(--radius-lg, 14px);
          background: var(--color-surface);
          box-shadow: var(--elevation-1);
          overflow: hidden;
        }
        caption {
          text-align: left; padding: var(--spacing-5, 16px) var(--spacing-6, 20px);
          font: var(--title-l);
          border-bottom: var(--border-thin, 1px) solid var(--color-outline-variant);
        }
        table { width: 100%; border-collapse: collapse; font: var(--body-m); }
        th {
          text-align: left; font: var(--label-m); letter-spacing: var(--tracking-label-m);
          color: var(--color-on-surface-variant); background: var(--color-surface-container);
          padding: ${pad} var(--spacing-5, 16px);
          border-bottom: var(--border-thin, 1px) solid var(--color-outline-variant);
          white-space: nowrap;
        }
        td { padding: ${pad} var(--spacing-5, 16px); border-bottom: var(--border-thin, 1px) solid var(--color-outline-variant); }
        tbody tr:last-child td { border-bottom: 0; }
        tbody tr { transition: background var(--duration-fast, 120ms) var(--ease-standard); }
        tbody tr:hover { background: var(--color-surface-container); }
        :host([striped]) tbody tr:nth-child(even) { background: var(--color-surface-container); }
        :host([striped]) tbody tr:nth-child(even):hover { background: var(--color-surface-container); }
      </style>
      <div class="frame" part="frame">
        <table part="table">
          ${caption ? `<caption>${caption}</caption>` : ""}
          <thead><tr>${columns.map(c => `<th scope="col">${c}</th>`).join("")}</tr></thead>
          <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    `;
    this.shadowRoot.querySelectorAll("tbody tr").forEach((tr, i) => {
      tr.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("rowclick", { detail: { index: i }, bubbles: true, composed: true }));
      });
    });
  }
}
customElements.define("ui-table", UITable);
export default UITable;
