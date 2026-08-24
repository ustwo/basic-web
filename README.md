# Basic Web Project

A minimal, dependency-free landing page with five reusable UI components, built as native [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (Custom Elements + Shadow DOM).

No build tools, no frameworks, no package manager, no bundler. Just HTML, CSS and JavaScript, loaded directly by the browser.

## Features

- **Zero dependencies** — nothing to `npm install`, nothing to compile.
- **Five reusable components** — button, text field, checkbox, toggle, and select, each a self-contained custom element.
- **Encapsulated styles** — every component uses Shadow DOM, so its internal markup and CSS can't leak into or be broken by the page.
- **Themeable** — components inherit CSS custom properties from the page, so changing a handful of variables re-themes everything at once.
- **Accessible by default** — components wrap native `<button>`, `<input>`, `<select>` and `<label>` elements, keeping built-in keyboard support and screen-reader semantics.

## Quick start

Serve the project directory over HTTP (required — the JavaScript uses ES modules, which browsers block from loading over `file://`):

```bash
cd basic-web-project
python3 -m http.server 4173
```

Then open **http://localhost:4173**. Any other static file server (`npx serve .`, `php -S localhost:4173`, etc.) works just as well.

## Project structure

```
index.html              Landing page markup
tokens/
  colors.json           The single source of truth for all color values
css/
  styles.css            Spacing/radius/font tokens + page layout (no colors)
js/
  tokens.js              Fetches tokens/colors.json, applies --color-* on :root
  main.js                Registers components, wires up the live demo
  components/
    ui-button.js
    ui-textfield.js
    ui-checkbox.js
    ui-toggle.js
    ui-select.js
```

## Components

| Element           | Attributes                                    | Events                                    |
| ----------------- | ---------------------------------------------- | ------------------------------------------ |
| `<ui-button>`     | `variant="primary\|secondary"`, `disabled`     | native `click`                            |
| `<ui-textfield>`  | `label`, `placeholder`, `type`, `value`        | `input` — `detail.value`                  |
| `<ui-checkbox>`   | `label`, `checked`                             | `change` — `detail.checked`               |
| `<ui-toggle>`     | `label`, `checked`                             | `change` — `detail.checked`               |
| `<ui-select>`     | `label`, `options="A,B,C"`, `value`            | `change` — `detail.value`                 |

### Usage

```html
<script type="module" src="js/main.js"></script>

<ui-button variant="primary">Save</ui-button>

<ui-textfield label="Full name" placeholder="Jane Doe"></ui-textfield>

<ui-checkbox label="Subscribe to updates"></ui-checkbox>

<ui-toggle label="Enable notifications"></ui-toggle>

<ui-select label="Favorite color" options="Red,Green,Blue"></ui-select>
```

```js
document.querySelector("ui-textfield").addEventListener("input", (e) => {
  console.log(e.detail.value);
});
```

### Theming

Every component reads its colors, spacing and border radius from CSS custom properties on `:root`. Custom properties pierce the Shadow DOM boundary, so changing the source once re-themes every component without touching component code.

**Colors** live only in [`tokens/colors.json`](tokens/colors.json) — there are no color values anywhere else in the project (no fallbacks in CSS, no fallbacks in component styles). [`js/tokens.js`](js/tokens.js) fetches that file on load and sets each `--color-*` property on `:root`:

```json
{
  "color": {
    "primary": "#7c3aed",
    "primary-hover": "#6d28d9"
  }
}
```

To retheme colors, edit `tokens/colors.json` only. This is also the file an automated Figma → repo token sync would write to.

**Spacing, radius and font** are plain CSS custom properties in [`css/styles.css`](css/styles.css):

```css
:root {
  --radius: 10px;
}
```

## Browser support

Any evergreen browser (Chrome, Firefox, Safari, Edge) with support for Custom Elements, Shadow DOM and ES modules — all standard, widely supported web platform features.

## License

No license specified. Use at your own discretion.
