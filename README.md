# Basic Web Project

A minimal, dependency-free landing page with fifteen reusable UI components, built as native [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (Custom Elements + Shadow DOM).

No build tools, no frameworks, no package manager, no bundler. Just HTML, CSS and JavaScript, loaded directly by the browser.

## Features

- **Zero dependencies** — nothing to `npm install`, nothing to compile.
- **Fifteen reusable components** — form controls, feedback, and layout primitives, each a self-contained custom element.
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
  tokens.json           The single source of truth for all color values
css/
  styles.css            Spacing/radius/font tokens + page layout (no colors)
js/
  tokens.js              Fetches tokens/tokens.json, applies --color-* on :root
  main.js                Registers components, wires up the live demo
  components/
    ui-button.js
    ui-textfield.js
    ui-textarea.js
    ui-checkbox.js
    ui-toggle.js
    ui-radio.js
    ui-select.js
    ui-badge.js
    ui-card.js
    ui-avatar.js
    ui-alert.js
    ui-tooltip.js
    ui-spinner.js
    ui-progress.js
    ui-tabs.js
```

## Components

| Element           | Attributes                                              | Events                        |
| ----------------- | --------------------------------------------------------- | ------------------------------- |
| `<ui-button>`     | `variant="primary\|secondary"`, `disabled`               | native `click`                |
| `<ui-textfield>`  | `label`, `placeholder`, `type`, `value`                  | `input` — `detail.value`      |
| `<ui-textarea>`   | `label`, `placeholder`, `value`, `rows`                  | `input` — `detail.value`      |
| `<ui-checkbox>`   | `label`, `checked`                                       | `change` — `detail.checked`   |
| `<ui-toggle>`     | `label`, `checked`                                       | `change` — `detail.checked`   |
| `<ui-radio>`      | `name`, `value`, `label`, `checked`                      | `change` — `detail.value`     |
| `<ui-select>`     | `label`, `options="A,B,C"`, `value`                      | `change` — `detail.value`     |
| `<ui-badge>`      | `variant="neutral\|primary\|success\|warning\|danger"`   | —                              |
| `<ui-card>`       | slots: default, `header`, `footer`                       | —                              |
| `<ui-avatar>`     | `src`, `alt`, `name`, `size`                              | —                              |
| `<ui-alert>`      | `variant="info\|success\|warning\|danger"`, `dismissible`| `dismiss`                     |
| `<ui-tooltip>`    | `text`, `position="top\|bottom\|left\|right"`            | —                              |
| `<ui-spinner>`    | `size`, `label`                                          | —                              |
| `<ui-progress>`   | `value`, `max`, `label`                                  | —                              |
| `<ui-tabs>`       | `selected` (index); children use a `label` attribute     | —                              |

Radios sharing the same `name` form a group automatically (only one can be checked). Tabs treat each direct child as a panel — its `label` attribute becomes the tab title.

### Usage

```html
<script type="module" src="js/main.js"></script>

<ui-button variant="primary">Save</ui-button>

<ui-textfield label="Full name" placeholder="Jane Doe"></ui-textfield>

<ui-checkbox label="Subscribe to updates"></ui-checkbox>

<ui-toggle label="Enable notifications"></ui-toggle>

<ui-select label="Favorite color" options="Red,Green,Blue"></ui-select>

<ui-radio name="plan" value="basic" label="Basic" checked></ui-radio>
<ui-radio name="plan" value="pro" label="Pro"></ui-radio>

<ui-alert variant="success" dismissible>Saved successfully.</ui-alert>

<ui-tabs>
  <div label="Overview">Overview panel content.</div>
  <div label="Details">Details panel content.</div>
</ui-tabs>
```

```js
document.querySelector("ui-textfield").addEventListener("input", (e) => {
  console.log(e.detail.value);
});

document.querySelector("ui-radio").addEventListener("change", (e) => {
  console.log(e.detail.value);
});
```

### Theming

Every component reads its colors, spacing and border radius from CSS custom properties on `:root`. Custom properties pierce the Shadow DOM boundary, so changing the source once re-themes every component without touching component code.

**Colors** live only in [`tokens/tokens.json`](tokens/tokens.json) — there are no hardcoded color values anywhere else in the project. That file mirrors a real design-token export (e.g. Tokens Studio / Figma Variables), so its keys are camelCase and colors sit under `color.hex`:

```json
{
  "color": {
    "hex": {
      "colorBg": "#ffffff",
      "colorBgAlt": "#f5f6f8",
      "colourText": "#1a1d21",
      "colorTextMuted": "#5b6270",
      "colorPrimary": "#2f6fed",
      "colorBorder": "#d7dbe0",
      "colorFocus": "#2f6fed",
      "colorScrim": "#0000003f",
      "colorWarning": "#dc6e00",
      "colorCritical": "#f93232"
    }
  }
}
```

[`js/tokens.js`](js/tokens.js) fetches that file on load, translates each `color.hex` key to this project's `--color-*` naming via `COLOR_TOKEN_MAP` (e.g. `colorCritical` → `--color-danger`), and sets it on `:root`. Keeping that translation table in `tokens.js` means the token source's naming can stay whatever the design tool exports, without renaming component-facing CSS variables to match.

Two colors the components need — `--color-primary-hover` (button hover) and `--color-success` (badge/alert) — aren't in the current token export. Until the design source adds `colorPrimaryHover` and `colorSuccess`, `tokens.js` derives them itself: `--color-primary-hover` is computed by darkening `colorPrimary` by 15%, and `--color-success` falls back to a hardcoded green (`#1a7f37`). Both are clearly marked in `tokens.js` as stopgaps — replace them by adding the real keys to `tokens/tokens.json` once the design source defines them, and delete the fallback code.

To retheme colors, edit `tokens/tokens.json` only — this is also the file an automated Figma → repo token sync would write to.

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
