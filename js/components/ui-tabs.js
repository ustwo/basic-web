/**
 * <ui-tabs selected="0">
 *   <div label="Tab 1">Panel 1</div>
 *   <div label="Tab 2">Panel 2</div>
 * </ui-tabs>
 * Each direct child becomes a panel; its `label` attribute becomes the tab title.
 */
class UITabs extends HTMLElement {
  static get observedAttributes() {
    return ["selected"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--font-family, inherit);
        }
        .tablist {
          display: flex;
          gap: var(--spacing-3, 1rem);
          border-bottom: 1px solid var(--color-border);
        }
        button {
          font: inherit;
          padding: var(--spacing-2, 0.5rem) 0;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
        }
        button.active {
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
        button:focus-visible {
          outline: 2px solid var(--color-focus);
          outline-offset: 2px;
        }
      </style>
      <div class="tablist" role="tablist"></div>
      <slot name="tab"></slot>
    `;

    // Delegated on shadowRoot so it keeps working across renderTabs() calls.
    this.shadowRoot.addEventListener("click", (e) => {
      const button = e.target.closest("[data-index]");
      if (!button) return;
      this.setAttribute("selected", button.dataset.index);
    });
    this.shadowRoot
      .querySelector("slot")
      .addEventListener("slotchange", () => this.renderTabs());

    this.renderTabs();
  }

  attributeChangedCallback(name) {
    if (name === "selected" && this.shadowRoot.firstChild) this.renderTabs();
  }

  renderTabs() {
    const panels = Array.from(this.children);
    const selected = Math.min(
      Math.max(Number(this.getAttribute("selected")) || 0, 0),
      Math.max(panels.length - 1, 0)
    );

    this.shadowRoot.querySelector(".tablist").innerHTML = panels
      .map(
        (panel, i) => `
          <button type="button" data-index="${i}" class="${i === selected ? "active" : ""}" role="tab" aria-selected="${i === selected}">
            ${panel.getAttribute("label") || `Tab ${i + 1}`}
          </button>
        `
      )
      .join("");

    panels.forEach((panel, i) => {
      panel.slot = "tab";
      panel.setAttribute("role", "tabpanel");
      panel.hidden = i !== selected;
    });
  }
}

customElements.define("ui-tabs", UITabs);
