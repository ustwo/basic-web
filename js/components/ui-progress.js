/**
 * <ui-progress value="60" max="100" label="Uploading"></ui-progress>
 */
class UIProgress extends HTMLElement {
  static get observedAttributes() {
    return ["value", "max", "label"];
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
    const max = Number(this.getAttribute("max")) || 100;
    const value = Math.min(Number(this.getAttribute("value")) || 0, max);
    const percent = max > 0 ? (value / max) * 100 : 0;
    const label = this.getAttribute("label") || "";

    this.shadowRoot.innerHTML = `
      <style>
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-1, 0.25rem);
          font-family: var(--font-family, inherit);
        }
        label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .track {
          width: 100%;
          height: 0.5rem;
          border-radius: 999px;
          background: var(--color-border);
          overflow: hidden;
        }
        .fill {
          height: 100%;
          width: ${percent}%;
          background: var(--color-primary);
          transition: width 0.15s ease;
        }
      </style>
      <div class="field">
        ${label ? `<label>${label}</label>` : ""}
        <div class="track" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}">
          <div class="fill"></div>
        </div>
      </div>
    `;
  }
}

customElements.define("ui-progress", UIProgress);
