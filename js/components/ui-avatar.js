/**
 * <ui-avatar src="..." alt="..." name="Jane Doe" size="40"></ui-avatar>
 * Renders the image if `src` is set, otherwise initials derived from `name`.
 */
class UIAvatar extends HTMLElement {
  static get observedAttributes() {
    return ["src", "alt", "name", "size"];
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
    const src = this.getAttribute("src");
    const name = this.getAttribute("name") || "";
    const alt = this.getAttribute("alt") || name;
    const size = this.getAttribute("size") || "40";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");

    this.shadowRoot.innerHTML = `
      <style>
        .avatar {
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--color-primary);
          color: var(--color-bg);
          font-family: var(--font-family, inherit);
          font-size: calc(${size}px * 0.4);
          font-weight: 600;
        }
        img.avatar {
          object-fit: cover;
        }
      </style>
      ${
        src
          ? `<img class="avatar" src="${src}" alt="${alt}" />`
          : `<span class="avatar" role="img" aria-label="${alt}">${initials}</span>`
      }
    `;
  }
}

customElements.define("ui-avatar", UIAvatar);
