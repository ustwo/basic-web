/**
 * <ui-chip variant="primary" removable>Design</ui-chip>
 * A compact tag. With "removable" it shows a close button and fires "remove".
 */
class UIChip extends HTMLElement {
  static get observedAttributes() { return ["variant", "removable", "disabled"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const variant = this.getAttribute("variant") || "neutral";
    const removable = this.hasAttribute("removable");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-flex; }
        .chip {
          display: inline-flex; align-items: center; gap: var(--spacing-2, 4px);
          padding: var(--spacing-2, 4px) var(--spacing-3, 8px) var(--spacing-2, 4px) var(--spacing-4, 12px);
          border-radius: var(--radius-pill, 9999px);
          font: var(--label-s); letter-spacing: var(--tracking-label-s);
          border: var(--border-thin, 1px) solid transparent;
        }
        .chip:not(.has-x) { padding-right: var(--spacing-4, 12px); }
        .neutral { background: var(--color-surface-container); color: var(--color-on-surface-variant); border-color: var(--color-outline-variant); }
        .primary { background: var(--color-primary-container); color: var(--color-primary); }
        .success { background: var(--color-success-container); color: var(--color-success); }
        .danger { background: var(--color-error-container); color: var(--color-error); }
        button {
          border: 0; background: transparent; color: currentColor;
          width: 16px; height: 16px; border-radius: 50%;
          display: grid; place-items: center; cursor: pointer;
          font-size: 12px; line-height: 1; opacity: var(--opacity-muted, 0.75);
          transition: opacity var(--duration-fast, 120ms) var(--ease-standard), background var(--duration-fast, 120ms) var(--ease-standard);
        }
        button:hover { opacity: 1; background: rgba(0,0,0,0.08); }
        button:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
      </style>
      <span class="chip ${variant} ${removable ? "has-x" : ""}" part="chip">
        <slot></slot>
        ${removable ? '<button type="button" aria-label="Remove">×</button>' : ""}
      </span>
    `;
    const btn = this.shadowRoot.querySelector("button");
    if (btn) btn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("remove", { bubbles: true, composed: true }));
    });
  }
}
customElements.define("ui-chip", UIChip);
export default UIChip;
