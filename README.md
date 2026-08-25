# LDS

Styled from the **Prisma Design System** — light theme, PC type scale.

A dependency-free component library: **28 components** built as native
[Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
(Custom Elements + Shadow DOM).

No build tools, no frameworks, no package manager, no bundler. Just HTML, CSS and
JavaScript, loaded directly by the browser.

## Quick start

Serve the directory over HTTP — the JavaScript uses ES modules, which browsers block
over `file://`:

```
python3 -m http.server 4173
```

Then open <http://localhost:4173>. Any static server works.

## Project structure

```
index.html              Demo page for every component
tokens/
  tokens.json           Single source of truth for every design value
css/
  styles.css            Page layout only — no design values
js/
  tokens.js             Reads tokens.json, applies every group to :root
  main.js               Registers components, wires the demo
  components/           One file per component
```

## Components

### Actions
| Element | Attributes | Events |
| --- | --- | --- |
| `<ui-button>` | `variant`, `size`, `disabled`, `full`, `type` | native `click` |
| `<ui-icon-button>` | `label`, `variant`, `size`, `disabled` | native `click` |
| `<ui-dropdown>` | `label`, `options`, `align`, `disabled` | `select` — `detail.value`, `detail.index` |

### Form controls
| Element | Attributes | Events |
| --- | --- | --- |
| `<ui-textfield>` | `label`, `placeholder`, `type`, `value`, `hint`, `error`, `invalid` | `input` — `detail.value` |
| `<ui-search-field>` | `placeholder`, `value` | `search` — `detail.query` |
| `<ui-textarea>` | `label`, `placeholder`, `value`, `rows`, `hint` | `input` — `detail.value` |
| `<ui-checkbox>` | `label`, `checked` | `change` — `detail.checked` |
| `<ui-toggle>` | `label`, `checked` | `change` — `detail.checked` |
| `<ui-radio>` | `name`, `value`, `label`, `checked` | `change` — `detail.value` |
| `<ui-select>` | `label`, `options`, `value` | `change` — `detail.value` |
| `<ui-slider>` | `label`, `value`, `min`, `max`, `step` | `input` — `detail.value` |

### Data display
| Element | Attributes | Events |
| --- | --- | --- |
| `<ui-badge>` | `variant`, `size`, `dot` | — |
| `<ui-chip>` | `variant`, `removable` | `remove` |
| `<ui-avatar>` | `src`, `alt`, `name`, `size`, `status` | — |
| `<ui-table>` | `columns`, `rows`, `caption`, `striped`, `compact` | `rowclick` — `detail.index` |
| `<ui-pagination>` | `page`, `total`, `siblings` | `change` — `detail.page` |

### Layout
| Element | Attributes | Events |
| --- | --- | --- |
| `<ui-card>` | `raised`, `flat`, `hoverable`; slots: default, `header`, `footer` | — |
| `<ui-divider>` | `label`, `vertical` | — |
| `<ui-tabs>` | `selected`, `variant`; children use `label` | `change` — `detail.index` |
| `<ui-accordion>` | `label`, `open` | `toggle` — `detail.open` |
| `<ui-modal>` | `heading`, `open`, `size`; slots: default, `footer` | `close` |

### Feedback
| Element | Attributes | Events |
| --- | --- | --- |
| `<ui-alert>` | `variant`, `title`, `dismissible` | `dismiss` |
| `<ui-toast>` | `variant`, `message`, `duration`, `position` | `dismiss` |
| `<ui-tooltip>` | `text`, `position` | — |
| `<ui-spinner>` | `size`, `label`, `variant` | — |
| `<ui-progress>` | `value`, `max`, `label`, `variant`, `indeterminate` | — |
| `<ui-skeleton>` | `width`, `height`, `radius`, `lines`, `circle` | — |
| `<ui-empty-state>` | `title`, `description`, `icon`; slot = actions | — |

Radios sharing a `name` form a group automatically. Tabs treat each direct child as a
panel — its `label` attribute becomes the tab title.

## Theming

Every component reads its values from CSS custom properties on `:root`. Custom
properties pierce the Shadow DOM boundary, so changing the source once re-themes every
component without touching component code.

**Everything lives in [`tokens/tokens.json`](tokens/tokens.json)** — there are no
hardcoded design values anywhere else. The file mirrors a real design-token export
(Tokens Studio / Figma Variables), so keys are camelCase and grouped by type:

```json
{
  "color":       { "hex": { "colorPrimary": "#6C43C6", "colorOnSurface": "#161C27" } },
  "typography":  { "font": { "bodyM": "400 14px/20px var(--font-family-base)" } },
  "shadow":      { "css": { "elevation2": "0 2px 4px rgba(22, 28, 39, 0.05), …" } },
  "blur":        { "pX":  { "blurWindow": 40 } },
  "spacing":     { "pX":  { "spacing5": 16 } },
  "radius":      { "pX":  { "radiusMd": 12 } },
  "motion":      { "css": { "durationBase": "200ms" } },
  "zIndex":      { "n":   { "zModal": 1300 } },
  "borderWidth": { "pX":  { "borderThin": 1 } },
  "opacity":     { "n":   { "opacityDisabled": 0.38 } }
}
```

### What the components read

| Group | CSS properties |
| --- | --- |
| Interactive | `--color-primary`, `--color-on-primary`, `--color-primary-container`, and the same four for `secondary`, `tertiary`, `focus` |
| State | `--color-primary-hover`, `--color-primary-pressed`, `--color-surface-container-hover`, … |
| Semantic | `--color-error`, `--color-warning`, `--color-success`, each with `on-` and `-container` |
| Surface | `--color-surface`, `--color-surface-container`, `--color-surface-container-highest`, `--color-surface-blur[-high\|-low]`, `--color-inverse-surface` |
| Text | `--color-on-surface`, `--color-on-surface-variant`, `--color-on-surface-muted` |
| Outline & overlay | `--color-outline`, `--color-outline-variant`, `--color-scrim` |
| Type | `--display-*`, `--headline-*`, `--title-*`, `--label-*`, `--body-*` plus `--tracking-*` |
| Elevation | `--elevation-1` … `--elevation-5`, `--elevation-bottom`, `--shadow-focus` |

**Type comes with tracking as a separate property.** The scale specifies letter-spacing
per style, and a CSS `font:` shorthand cannot carry it, so a component sets both:

```css
font: var(--label-m);
letter-spacing: var(--tracking-label-m);
```

**Light mode only.** The source system publishes light and dark, but this project has no
mode-switching logic. Carrying both would mean writing one set of properties and leaving
the other unreachable. The token structure is ready for it: adding `color.light` /
`color.dark` is additive, since `tokens.js` reads by group path.

**PC type scale only.** The source publishes PC, tablet and mobile. Importing three
scales would mean choosing between them at render time with nothing to choose on.

### Legacy aliases

`tokens.js` also sets a table of older names (`--color-text`, `--shadow-md`,
`--text-sm`) as `var()` references to their current equivalents. A component still on
an old name re-themes correctly instead of silently falling back, and an upstream rename
is a one-line change rather than a find-and-replace through 28 files.

[`js/tokens.js`](js/tokens.js) fetches that file and applies every group, translating
each export key to this project's CSS naming through a per-group table. Keeping the
translation there means the design tool's naming can stay whatever it exports — note
`colourText` beside `colorBg`, and `colorCritical` → `--color-danger` — without
renaming component-facing variables to match.

Numbers get their unit at apply time (`spacing5: 16` → `--spacing-5: 16px`), so the
token file stays a data file rather than a stylesheet.

To retheme, edit `tokens/tokens.json` only. This is also the file an automated
Figma → repo token sync writes to.

## Conventions

Every component follows the same contract, which is what makes the library machine-readable:

1. **A doc comment with a concrete usage example.** Real values, not placeholders — tooling reads these as sample data.
2. **`static get observedAttributes()`** declaring every attribute it reads.
3. **No hardcoded design values.** Every colour, space, radius, shadow and font comes from a custom property, with a `var()` fallback as a last resort rather than a second source of truth.
4. **Native elements inside.** Components wrap real `<button>`, `<input>`, `<select>` and `<label>` elements, keeping built-in keyboard support and screen-reader semantics.
5. **Events carry a `detail`** and are `composed`, so they cross the shadow boundary.

## Browser support

Any evergreen browser with Custom Elements, Shadow DOM and ES modules.
