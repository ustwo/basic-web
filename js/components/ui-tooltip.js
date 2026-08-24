/**
 * <ui-tooltip text="More info" position="top|bottom|left|right">
 *   <ui-button>Hover me</ui-button>
 * </ui-tooltip>
 * Wraps its slotted content and shows the tooltip on hover/focus.
 */
const PLACEMENTS = {
  top: "bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: var(--spacing-1, 0.25rem);",
  bottom: "top: 100%; left: 50%; transform: translateX(-50%); margin-top: var(--spacing-1, 0.25rem);",
  left: "right: 100%; top: 50%; transform: translateY(-50%); margin-right: var(--spacing-1, 0.25rem);",
  right: "left: 100%; top: 50%; transform: translateY(-50%); margin-left: var(--spacing-1, 0.25rem);",
};

class UITooltip extends HTMLElement {
  static get observedAttributes() {
    return ["text", "position"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const text = this.getAttribute("text") || "";
    const placement = PLACEMENTS[this.getAttribute("position")] || PLACEMENTS.top;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: relative;
          display: inline-block;
        }
        .bubble {
          position: absolute;
          ${placement}
          background: var(--color-text);
          color: var(--color-bg);
          font-family: var(--font-family, inherit);
          font-size: 0.8rem;
          padding: var(--spacing-1, 0.25rem) var(--spacing-2, 0.5rem);
          border-radius: var(--radius, 6px);
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.1s ease;
          z-index: 10;
        }
        :host(:hover) .bubble,
        :host(:focus-within) .bubble {
          opacity: 1;
        }
      </style>
      <slot></slot>
      <span class="bubble" role="tooltip">${text}</span>
    `;
  }
}

customElements.define("ui-tooltip", UITooltip);
