# ng-hub-ui-board - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-board`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Importing Styles](#importing-styles)
- [Base System Fallbacks](#base-system-fallbacks)
- [Board Variables](#board-variables)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

The board styles use a token fallback chain:

```text
component token -> legacy token -> sys token -> ref token -> literal fallback
```

This allows:

- canonical board tokens (`--hub-board-*`) for new integrations,
- backward compatibility with existing legacy tokens,
- runtime theming via CSS custom properties.

---

## Importing Styles

Add board styles to your global stylesheet:

```scss
@use 'ng-hub-ui-board/src/lib/styles/base.scss';
```

---

## Base System Fallbacks

`ng-hub-ui-board` defines and/or consumes these base tokens:

| Variable | Default |
|---|---|
| `--hub-ref-color-white` | `#fff` |
| `--hub-ref-space-2` | `0.5rem` |
| `--hub-ref-space-3` | `1rem` |
| `--hub-ref-radius-md` | `0.375rem` |
| `--hub-ref-border-width` | `1px` |
| `--hub-sys-text-primary` | `#212529` |
| `--hub-sys-text-muted` | `#6c757d` |
| `--hub-sys-surface-page` | `#fff` |
| `--hub-sys-surface-elevated` | `rgba(0, 0, 0, 0.03)` |
| `--hub-sys-border-color-default` | `#dee2e6` |
| `--hub-sys-color-primary` | `#0d6efd` |
| `--hub-sys-color-primary-subtle` | `rgba(13, 110, 253, 0.05)` |

---

## Board Variables

Defined and consumed by `projects/board/src/lib/styles/base.scss`.

### Core

| Variable | Default |
|---|---|
| `--hub-board-container-color` | `var(--hub-body-color, var(--hub-sys-text-primary, #212529))` |
| `--hub-board-container-bg` | `var(--hub-body-bg, var(--hub-sys-surface-page, #fff))` |
| `--hub-board-border-width` | `var(--hub-ref-border-width, 1px)` |
| `--hub-board-border-color` | `var(--hub-border-color, var(--hub-sys-border-color-default, #dee2e6))` |
| `--hub-board-border-radius` | `var(--hub-border-radius, var(--hub-ref-radius-md, 0.375rem))` |
| `--hub-board-columns-gap` | `var(--hub-ref-space-3, 1rem)` |

### Column

| Variable | Default |
|---|---|
| `--hub-board-column-width` | `256px` |
| `--hub-board-column-min-height` | `200px` |
| `--hub-board-column-body-min-height` | `128px` |
| `--hub-board-column-body-gap` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-board-column-spacer-y` | `var(--hub-column-spacer-y, 0.75rem)` |
| `--hub-board-column-spacer-x` | `var(--hub-column-spacer-x, var(--hub-ref-space-3, 1rem))` |
| `--hub-board-column-border-width` | `var(--hub-column-border-width, var(--hub-ref-border-width, 1px))` |
| `--hub-board-column-border-color` | `var(--hub-column-border-color, var(--hub-sys-border-color-default, rgba(0, 0, 0, 0.175)))` |
| `--hub-board-column-border-radius` | `var(--hub-column-border-radius, var(--hub-ref-radius-md, 0.375rem))` |
| `--hub-board-column-box-shadow` | `var(--hub-column-box-shadow, none)` |
| `--hub-board-column-inner-border-radius` | `var(--hub-column-inner-border-radius, var(--hub-board-border-radius, var(--hub-ref-radius-md, 0.375rem)))` |
| `--hub-board-column-cap-padding-y` | `var(--hub-column-cap-padding-y, var(--hub-ref-space-2, 0.5rem))` |
| `--hub-board-column-cap-padding-x` | `var(--hub-column-cap-padding-x, var(--hub-ref-space-3, 1rem))` |
| `--hub-board-column-cap-bg` | `var(--hub-column-cap-bg, var(--hub-sys-surface-elevated, rgba(0, 0, 0, 0.03)))` |
| `--hub-board-column-cap-color` | `var(--hub-column-cap-color, inherit)` |
| `--hub-board-column-header-title-color` | `var(--hub-column-header-title-color, inherit)` |
| `--hub-board-column-header-title-spacer-y` | `var(--hub-column-header-title-spacer-y, var(--hub-ref-space-2, 0.5rem))` |
| `--hub-board-column-header-subtitle-color` | `var(--hub-column-header-subtitle-color, var(--hub-sys-text-muted, #6c757d))` |
| `--hub-board-column-height` | `var(--hub-column-height, 100%)` |
| `--hub-board-column-color` | `var(--hub-column-color, var(--hub-board-container-color))` |
| `--hub-board-column-bg` | `var(--hub-column-bg, var(--hub-sys-surface-page, #fff))` |

### Card

| Variable | Default |
|---|---|
| `--hub-board-card-spacer-y` | `var(--hub-card-spacer-y, 0.75rem)` |
| `--hub-board-card-spacer-x` | `var(--hub-card-spacer-x, var(--hub-ref-space-3, 1rem))` |
| `--hub-board-card-title-spacer-y` | `var(--hub-card-title-spacer-y, var(--hub-ref-space-2, 0.5rem))` |
| `--hub-board-card-title-color` | `var(--hub-card-title-color, inherit)` |
| `--hub-board-card-subtitle-color` | `var(--hub-card-subtitle-color, var(--hub-sys-text-muted, #6c757d))` |
| `--hub-board-card-border-width` | `var(--hub-card-border-width, var(--hub-ref-border-width, 1px))` |
| `--hub-board-card-border-color` | `var(--hub-card-border-color, var(--hub-sys-border-color-default, rgba(0, 0, 0, 0.175)))` |
| `--hub-board-card-border-radius` | `var(--hub-card-border-radius, var(--hub-board-border-radius, var(--hub-ref-radius-md, 0.375rem)))` |
| `--hub-board-card-box-shadow` | `var(--hub-card-box-shadow, none)` |
| `--hub-board-card-inner-border-radius` | `var(--hub-card-inner-border-radius, calc(var(--hub-board-card-border-radius, var(--hub-ref-radius-md, 0.375rem)) - var(--hub-board-card-border-width, var(--hub-ref-border-width, 1px))))` |
| `--hub-board-card-cap-padding-y` | `var(--hub-card-cap-padding-y, var(--hub-ref-space-2, 0.5rem))` |
| `--hub-board-card-cap-padding-x` | `var(--hub-card-cap-padding-x, var(--hub-ref-space-3, 1rem))` |
| `--hub-board-card-cap-bg` | `var(--hub-card-cap-bg, var(--hub-sys-surface-elevated, rgba(0, 0, 0, 0.03)))` |
| `--hub-board-card-cap-color` | `var(--hub-card-cap-color, inherit)` |
| `--hub-board-card-height` | `var(--hub-card-height, auto)` |
| `--hub-board-card-color` | `var(--hub-card-color, var(--hub-board-container-color))` |
| `--hub-board-card-bg` | `var(--hub-card-bg, var(--hub-sys-surface-page, #fff))` |

### Drag and Placeholder

| Variable | Default |
|---|---|
| `--hub-board-drag-transition` | `var(--hub-drag-transition, transform 250ms cubic-bezier(0, 0, 0.2, 1))` |
| `--hub-board-placeholder-border-color` | `var(--hub-placeholder-border-color, var(--hub-sys-color-primary, #0d6efd))` |
| `--hub-board-placeholder-border-width` | `var(--hub-placeholder-border-width, 2px)` |
| `--hub-board-placeholder-border-style` | `var(--hub-placeholder-border-style, dashed)` |
| `--hub-board-placeholder-bg` | `var(--hub-placeholder-bg, var(--hub-sys-color-primary-subtle, rgba(13, 110, 253, 0.05)))` |
| `--hub-board-placeholder-min-height` | `var(--hub-placeholder-min-height, 60px)` |

### Legacy Alias Mapping

| Legacy token | Canonical token |
|---|---|
| `--hub-body-color` | `--hub-board-container-color` |
| `--hub-body-bg` | `--hub-board-container-bg` |
| `--hub-border-color` | `--hub-board-border-color` |
| `--hub-border-radius` | `--hub-board-border-radius` |
| `--hub-column-*` | `--hub-board-column-*` |
| `--hub-card-*` | `--hub-board-card-*` |
| `--hub-drag-transition` | `--hub-board-drag-transition` |
| `--hub-placeholder-*` | `--hub-board-placeholder-*` |

---

## Customization Examples

### Framework-Agnostic

```scss
.hub-board {
  --hub-board-columns-gap: 1.25rem;
  --hub-board-column-bg: #f8f9fa;
  --hub-board-card-bg: #ffffff;
  --hub-board-card-border-color: #d0d7de;
  --hub-board-placeholder-border-color: #0d6efd;
}
```

### Bootstrap Integration (Optional)

```scss
.hub-board {
  --hub-board-column-bg: var(--bs-light);
  --hub-board-card-bg: var(--bs-body-bg);
  --hub-board-card-border-color: var(--bs-border-color);
  --hub-board-placeholder-border-color: var(--bs-primary);
}
```

### Dense Board Layout

```scss
.hub-board {
  --hub-board-columns-gap: 0.75rem;
  --hub-board-column-width: 220px;
  --hub-board-card-spacer-y: 0.5rem;
  --hub-board-card-spacer-x: 0.75rem;
}
```

---

## Best Practices

- Prefer canonical `--hub-board-*` tokens for new code.
- Keep legacy `--hub-*` aliases only for compatibility with existing integrations.
- Override `--hub-sys-*` tokens for consistent cross-component theming.
- Prefer token overrides over direct selector overrides for maintainability.
