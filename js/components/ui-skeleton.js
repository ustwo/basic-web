/**
 * <ui-skeleton width="100%" height="16" radius="6" lines="3"></ui-skeleton>
 * A loading placeholder. With "lines" above 1 it renders a stack of bars,
 * the last one short, the way a paragraph actually ends.
 */
class UISkeleton extends HTMLElement {
  static get observedAttributes() { return ["width", "height", "radius", "lines", "circle"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const width = this.getAttribute("width") || "100%";
    const height = this.getAttribute("height") || "16";
    const radius = this.getAttribute("radius") || "6";
    const lines = Math.max(1, Number(this.getAttribute("lines") || 1));
    const circle = this.hasAttribute("circle");
    const h = /[a-z%]/i.test(height) ? height : height + "px";
    const r = circle ? "50%" : (/[a-z%]/i.test(radius) ? radius : radius + "px");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes shimmer { to { background-position: -200% 0; } }
        .stack { display: flex; flex-direction: column; gap: var(--spacing-3, 8px); }
        .bar {
          height: ${h}; border-radius: ${r};
          background: linear-gradient(90deg, var(--color-surface-container-highest) 0%, var(--color-surface-container) 50%, var(--color-surface-container-highest) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.4s var(--ease-standard) infinite;
        }
        .bar:last-child:not(:only-child) { width: 62%; }
        ${circle ? `.bar { width: ${h}; }` : ""}
      </style>
      <div class="stack" style="width: ${circle ? "auto" : width}" aria-hidden="true" part="stack">
        ${Array.from({ length: lines }, () => '<div class="bar"></div>').join("")}
      </div>
    `;
  }
}
customElements.define("ui-skeleton", UISkeleton);
export default UISkeleton;
