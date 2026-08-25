/**
 * <ui-avatar name="Jane Doe" size="40" status="online"></ui-avatar>
 * With "src" it shows the image; without one it shows initials from "name".
 * Status: none, online, away, busy.
 */
class UIAvatar extends HTMLElement {
  static get observedAttributes() { return ["src", "alt", "name", "size", "status"]; }
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }
  render() {
    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || this.getAttribute("name") || "";
    const name = this.getAttribute("name") || "";
    const size = Number(this.getAttribute("size") || 40);
    const status = this.getAttribute("status") || "none";
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font: var(--body-l); letter-spacing: var(--tracking-body-l); color: var(--color-on-surface); }
        :host([hidden]) { display: none; }
        *, *::before, *::after { box-sizing: border-box; }
        :host { display: inline-block; }
        .wrap { position: relative; width: ${size}px; height: ${size}px; }
        .face {
          width: 100%; height: 100%; border-radius: var(--radius-pill, 9999px);
          overflow: hidden; display: grid; place-items: center;
          background: var(--color-primary-container); color: var(--color-primary);
          font: var(--label-m); font-size: ${Math.max(11, Math.round(size * 0.36))}px; letter-spacing: var(--tracking-label-m);
          border: var(--border-medium, 2px) solid var(--color-surface);
          box-shadow: var(--elevation-1);
          user-select: none;
        }
        img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .status {
          position: absolute; right: -1px; bottom: -1px;
          width: ${Math.max(8, Math.round(size * 0.26))}px; height: ${Math.max(8, Math.round(size * 0.26))}px;
          border-radius: 50%; border: 2px solid var(--color-surface);
        }
        .online { background: var(--color-success); }
        .away { background: var(--color-warning); }
        .busy { background: var(--color-error); }
      </style>
      <div class="wrap">
        <div class="face" part="face">
          ${src ? `<img src="${src}" alt="${alt}" />` : (initials || "?")}
        </div>
        ${status !== "none" ? `<span class="status ${status}" title="${status}"></span>` : ""}
      </div>
    `;
  }
}
customElements.define("ui-avatar", UIAvatar);
export default UIAvatar;
