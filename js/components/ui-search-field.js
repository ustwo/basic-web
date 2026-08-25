/**
 * <ui-search-field placeholder="Search components" value=""></ui-search-field>
 * Fires "search" with detail.query on input, and again on Enter.
 * Shows a clear button once there is a value.
 */
class UISearchField extends HTMLElement {
  static get observedAttributes() { return ["placeholder", "value", "disabled"]; }

  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const placeholder = this.getAttribute("placeholder") || "Search";
    const value = this.getAttribute("value") || "";
    const disabled = this.hasAttribute("disabled");

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        .box {
          display: flex; align-items: center; gap: var(--spacing-3, 8px);
          background: var(--color-surface-container);
          border: var(--border-thin, 1px) solid transparent;
          border-radius: var(--radius-pill, 9999px);
          padding: 0 var(--spacing-4, 12px);
          min-height: 40px;
          transition: background var(--duration-fast, 120ms) var(--ease-standard), box-shadow var(--duration-fast, 120ms) var(--ease-standard);
        }
        .box:hover { background: var(--color-surface-container-highest); }
        .box:focus-within { background: var(--color-surface); border-color: var(--color-primary); box-shadow: var(--shadow-focus, 0 0 0 3px rgba(0,111,238,0.35)); }
        svg { flex: none; width: 16px; height: 16px; color: var(--color-on-surface-muted); }
        input { flex: 1; min-width: 0; border: 0; background: transparent; outline: none; font: var(--body-m); color: var(--color-on-surface); padding: var(--spacing-3, 8px) 0; }
        input::placeholder { color: var(--color-on-surface-muted); }
        button {
          flex: none; border: 0; background: var(--color-outline-variant); color: var(--color-on-surface-variant);
          width: 18px; height: 18px; border-radius: var(--radius-pill, 9999px);
          cursor: pointer; font-size: 11px; line-height: 1; display: grid; place-items: center;
        }
        button:hover { background: var(--color-on-surface-muted); color: var(--color-surface); }
        button[hidden] { display: none; }
      </style>
      <div class="box" part="box">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5"></circle><path d="M10.5 10.5L14 14"></path>
        </svg>
        <input type="search" placeholder="${placeholder}" value="${value}" ${disabled ? "disabled" : ""} />
        <button type="button" aria-label="Clear search" ${value ? "" : "hidden"}>×</button>
      </div>
    `;

    const input = this.shadowRoot.querySelector("input");
    const clear = this.shadowRoot.querySelector("button");
    const emit = q => this.dispatchEvent(new CustomEvent("search", { detail: { query: q }, bubbles: true, composed: true }));
    input.addEventListener("input", e => {
      this.setAttribute("value", e.target.value);
      emit(e.target.value);
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter") emit(input.value); });
    clear.addEventListener("click", () => { this.setAttribute("value", ""); emit(""); });
  }
}

customElements.define("ui-search-field", UISearchField);
export default UISearchField;
