/**
 * <ui-empty-state title="No projects yet" description="Create your first project to get started."><ui-button>New project</ui-button></ui-empty-state>
 * Slotted content becomes the action row.
 */
class UIEmptyState extends HTMLElement {
  static get observedAttributes() { return ["title", "description", "icon"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const title = this.getAttribute("title") || "";
    const description = this.getAttribute("description") || "";
    const icon = this.getAttribute("icon") || "";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .empty {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: var(--spacing-4, 12px);
          padding: var(--spacing-9, 40px) var(--spacing-7, 24px);
          border: var(--border-thin, 1px) dashed var(--color-outline);
          border-radius: var(--radius-lg, 14px);
          background: var(--color-surface-container);
        }
        .glyph {
          width: 44px; height: 44px; border-radius: var(--radius-md, 10px);
          display: grid; place-items: center;
          background: var(--color-surface); border: var(--border-thin, 1px) solid var(--color-outline-variant);
          box-shadow: var(--elevation-1); font-size: 20px; color: var(--color-on-surface-muted);
        }
        h3 { margin: 0; font: var(--title-l); }
        p { margin: 0; font: var(--body-m); color: var(--color-on-surface-variant); max-width: 46ch; }
        .actions { display: flex; gap: var(--spacing-3, 8px); margin-top: var(--spacing-2, 4px); }
      </style>
      <div class="empty" part="empty">
        ${icon ? `<span class="glyph">${icon}</span>` : ""}
        ${title ? `<h3>${title}</h3>` : ""}
        ${description ? `<p>${description}</p>` : ""}
        <span class="actions"><slot></slot></span>
      </div>
    `;
  }
}
customElements.define("ui-empty-state", UIEmptyState);
export default UIEmptyState;
